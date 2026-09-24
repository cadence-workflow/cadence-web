import { NextRequest, NextResponse } from 'next/server';

import logger from '../../../logger';
import { OIDC_SESSION_COOKIE_MAX_BYTES } from '../../auth.constants';
import { type CookieMutation } from '../../auth.types';
import validateAndReplayAuthCookieMutations, {
  measureAuthCookieMutationsBytes,
} from '../validate-and-replay-auth-cookie-mutations';

jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

const mockLoggerWarn = jest.mocked(logger.warn);

const COOKIE_NAMES = {
  exact: ['cadence-authorization'],
  prefixes: ['oidc-session'],
};

const buildRequest = (url = 'http://localhost/api/auth/recover') =>
  new NextRequest(url);

const getReplayedCookieNames = (response: NextResponse) =>
  response.cookies.getAll().map((c) => c.name);

describe(validateAndReplayAuthCookieMutations.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('replays exact-name and declared-prefix mutations in order', async () => {
    const response = NextResponse.json({});

    const result = await validateAndReplayAuthCookieMutations(
      buildRequest(),
      response,
      [
        { set: { name: 'cadence-authorization', value: 'token' } },
        { set: { name: 'oidc-session.0', value: 'chunk0', maxAge: 3600 } },
        { clear: { name: 'oidc-session.1' } },
      ],
      COOKIE_NAMES
    );

    expect(result).toEqual({ ok: true });
    expect(getReplayedCookieNames(response)).toEqual([
      'cadence-authorization',
      'oidc-session.0',
      'oidc-session.1',
    ]);
    expect(response.cookies.get('oidc-session.0')?.maxAge).toBe(3600);
  });

  it('rejects a name outside the declared set and replays nothing', async () => {
    const response = NextResponse.json({});

    const result = await validateAndReplayAuthCookieMutations(
      buildRequest(),
      response,
      [
        { set: { name: 'cadence-authorization', value: 'token' } },
        { set: { name: 'other-strategy-cookie', value: 'x' } },
      ],
      COOKIE_NAMES
    );

    expect(result).toEqual({
      ok: false,
      reason: 'unknown-cookie-name',
      name: 'other-strategy-cookie',
    });
    // validate-then-replay: even the valid first mutation is not applied
    expect(getReplayedCookieNames(response)).toEqual([]);
    expect(mockLoggerWarn).toHaveBeenCalled();
  });

  it('rejects an over-budget mutation set and replays nothing', async () => {
    const response = NextResponse.json({});
    const mutations: CookieMutation[] = [
      {
        set: {
          name: 'oidc-session.0',
          value: 'x'.repeat(OIDC_SESSION_COOKIE_MAX_BYTES),
        },
      },
    ];

    const result = await validateAndReplayAuthCookieMutations(
      buildRequest(),
      response,
      mutations,
      COOKIE_NAMES
    );

    expect(result).toMatchObject({ ok: false, reason: 'over-budget' });
    expect(getReplayedCookieNames(response)).toEqual([]);
  });

  it('warns on a non-Secure write to a non-loopback host', async () => {
    const response = NextResponse.json({});

    const result = await validateAndReplayAuthCookieMutations(
      buildRequest('http://cadence.internal.example/api/auth/recover'),
      response,
      [{ set: { name: 'cadence-authorization', value: 'token' } }],
      COOKIE_NAMES
    );

    expect(result).toEqual({ ok: true });
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      expect.objectContaining({ mutationCount: 1 }),
      'Writing auth cookies without the Secure attribute on a non-loopback host'
    );
  });

  it('does not warn on loopback hosts', async () => {
    for (const host of ['localhost', '127.0.0.1', 'dev.localhost']) {
      mockLoggerWarn.mockClear();
      const response = NextResponse.json({});

      await validateAndReplayAuthCookieMutations(
        buildRequest(`http://${host}/api/auth/recover`),
        response,
        [{ set: { name: 'cadence-authorization', value: 'token' } }],
        COOKIE_NAMES
      );

      expect(mockLoggerWarn).not.toHaveBeenCalled();
    }
  });

  it('does not warn when the write is Secure', async () => {
    const response = NextResponse.json({});
    const request = new NextRequest(
      'http://cadence.internal.example/api/auth/recover',
      { headers: { 'x-forwarded-proto': 'https' } }
    );

    await validateAndReplayAuthCookieMutations(
      request,
      response,
      [{ set: { name: 'cadence-authorization', value: 'token' } }],
      COOKIE_NAMES
    );

    expect(mockLoggerWarn).not.toHaveBeenCalled();
  });

  it('replays clears with the shared attributes and an epoch expiry', async () => {
    const response = NextResponse.json({});
    const request = new NextRequest('http://localhost/api/auth/recover', {
      headers: { 'x-forwarded-proto': 'https' },
    });

    await validateAndReplayAuthCookieMutations(
      request,
      response,
      [{ clear: { name: 'cadence-authorization' } }],
      COOKIE_NAMES
    );

    const cookie = response.cookies.get('cadence-authorization');
    expect(cookie?.value).toBe('');
    expect(cookie?.maxAge).toBe(0);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.path).toBe('/');
    // clears carry Secure too (same discipline)
    expect(cookie?.secure).toBe(true);
    expect(cookie?.expires && new Date(cookie.expires).getTime()).toBe(0);
  });

  describe('measurement mirrors ResponseCookies serialization', () => {
    it('counts the encodeURIComponent-escaped value, not the raw value', () => {
      // '{' escapes to '%7B': 1 byte raw, 3 bytes on the wire
      const value = '{'.repeat(100);
      expect(
        measureAuthCookieMutationsBytes(
          [{ set: { name: 'oidc-session.0', value } }],
          false
        )
      ).toBe(
        `oidc-session.0=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax`
          .length
      );
    });

    it('adds the auto-derived Expires attribute when maxAge is set', () => {
      const withMaxAge = measureAuthCookieMutationsBytes(
        [{ set: { name: 'oidc-session.0', value: 'v', maxAge: 3600 } }],
        false
      );
      const withoutMaxAge = measureAuthCookieMutationsBytes(
        [{ set: { name: 'oidc-session.0', value: 'v' } }],
        false
      );
      // @edge-runtime/cookies derives Expires from a truthy maxAge; any
      // RFC 1123 GMT date has the epoch stand-in's exact length
      expect(withMaxAge - withoutMaxAge).toBe(
        '; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=3600'.length
      );
    });

    it('counts UTF-8 wire bytes for non-ASCII values', () => {
      // 'é' → '%C3%A9' (6 bytes on the wire; 2 raw UTF-8 bytes)
      expect(
        measureAuthCookieMutationsBytes(
          [{ set: { name: 'oidc-session.0', value: 'é' } }],
          false
        )
      ).toBe('oidc-session.0=%C3%A9; Path=/; HttpOnly; SameSite=Lax'.length);
    });

    it('rejects a set whose raw value fits but whose escaped wire form exceeds the budget', async () => {
      const response = NextResponse.json({});
      // Overhead for this set is 47 bytes (name + '=' + attributes, no
      // Secure on plain-http loopback). Raw value length 4000-47 measures
      // exactly at budget; escaped ('{' → '%7B') it triples over.
      const mutations: CookieMutation[] = [
        {
          set: {
            name: 'oidc-session.0',
            value: '{'.repeat(OIDC_SESSION_COOKIE_MAX_BYTES - 47),
          },
        },
      ];

      const result = await validateAndReplayAuthCookieMutations(
        buildRequest(),
        response,
        mutations,
        COOKIE_NAMES
      );

      expect(result).toMatchObject({ ok: false, reason: 'over-budget' });
      expect(getReplayedCookieNames(response)).toEqual([]);
    });
  });
});
