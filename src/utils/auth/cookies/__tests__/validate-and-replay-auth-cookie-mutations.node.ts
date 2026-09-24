import { NextRequest, NextResponse } from 'next/server';

import logger from '../../../logger';
import { OIDC_SESSION_COOKIE_MAX_BYTES } from '../../auth.constants';
import { type CookieMutation } from '../../auth.types';
import validateAndReplayAuthCookieMutations from '../validate-and-replay-auth-cookie-mutations';

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
});
