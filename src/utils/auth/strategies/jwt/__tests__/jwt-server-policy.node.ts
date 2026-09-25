import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';

import { CADENCE_AUTH_COOKIE_NAME } from '../jwt-auth.constants';
import jwtServerPolicy from '../jwt-server-policy';

const buildRequest = (token?: string): AuthRequest => ({
  cookies: {
    get: (name: string) =>
      name === CADENCE_AUTH_COOKIE_NAME && token !== undefined
        ? { value: token }
        : undefined,
  },
  headers: new Headers(),
});

const buildContext = (overrides: Partial<AuthContext> = {}): AuthContext => ({
  authEnabled: true,
  auth: { isValidToken: true, canRefresh: false },
  isAdmin: false,
  groups: [],
  ...overrides,
});

describe('jwtServerPolicy', () => {
  describe('getGrpcMetadata', () => {
    it('returns the cadence-authorization metadata for a valid context', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(buildContext(), buildRequest('abc'))
      ).toEqual({ 'cadence-authorization': 'abc' });
    });

    it('returns undefined when the context is invalid even if a token is present', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          buildContext({ auth: { isValidToken: false, canRefresh: false } }),
          buildRequest('abc')
        )
      ).toBeUndefined();
    });

    it('returns undefined when auth is disabled', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          buildContext({ authEnabled: false }),
          buildRequest('abc')
        )
      ).toBeUndefined();
    });

    it('returns undefined when the cookie is gone', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(buildContext(), buildRequest())
      ).toBeUndefined();
    });
  });

  describe('getLoginRedirectIfNeeded', () => {
    it('returns null for a valid context', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(buildContext(), '/domains')
      ).toBeNull();
    });

    it('redirects to /login with a sanitized returnTo and notice', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          buildContext({ auth: { isValidToken: false, canRefresh: false } }),
          '/domains/foo',
          'session-expired'
        )
      ).toBe(
        `/login?returnTo=${encodeURIComponent('/domains/foo')}&notice=session-expired`
      );
    });

    it('never loops onto the login page itself', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          buildContext({ auth: { isValidToken: false, canRefresh: false } }),
          '/login?returnTo=%2Fdomains'
        )
      ).toBeNull();
    });

    it('sanitizes protocol-relative returnTo values', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          buildContext({ auth: { isValidToken: false, canRefresh: false } }),
          '//evil.test'
        )
      ).toBe(`/login?returnTo=${encodeURIComponent('/')}`);
    });
  });

  describe('recoverSession', () => {
    const buildJwt = (claims: Record<string, unknown>) => {
      const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
      return ['header', payload, 'signature'].join('.');
    };

    it('returns recovered with no mutations when the request credential is still fresh', async () => {
      const expSeconds = Math.floor(Date.now() / 1000) + 3600;
      const token = buildJwt({ sub: 'user', exp: expSeconds });

      await expect(
        jwtServerPolicy.recoverSession(buildRequest(token), {
          returnTo: '/domains/foo',
          notice: 'session-expired',
        })
      ).resolves.toEqual({
        result: { kind: 'recovered', expiresAtMs: expSeconds * 1000 },
      });
    });

    it('clears and redirects when the credential is expired', async () => {
      const token = buildJwt({
        sub: 'user',
        exp: Math.floor(Date.now() / 1000) - 10,
      });

      await expect(
        jwtServerPolicy.recoverSession(buildRequest(token), {})
      ).resolves.toEqual({
        result: { kind: 'redirect', returnTo: '/' },
        cookieMutations: [{ clear: { name: CADENCE_AUTH_COOKIE_NAME } }],
      });
    });

    it('returns the redirect outcome with a clear mutation for the jwt cookie', async () => {
      await expect(
        jwtServerPolicy.recoverSession(buildRequest('abc'), {
          returnTo: '/domains/foo',
          notice: 'session-expired',
        })
      ).resolves.toEqual({
        result: {
          kind: 'redirect',
          returnTo: '/domains/foo',
          notice: 'session-expired',
        },
        cookieMutations: [{ clear: { name: CADENCE_AUTH_COOKIE_NAME } }],
      });
    });

    it('defaults returnTo to /', async () => {
      await expect(
        jwtServerPolicy.recoverSession(buildRequest('abc'), {})
      ).resolves.toMatchObject({
        result: { kind: 'redirect', returnTo: '/' },
      });
    });
  });

  describe('getSessionKey', () => {
    it('returns the raw token', async () => {
      await expect(
        jwtServerPolicy.getSessionKey(buildRequest('abc'))
      ).resolves.toBe('abc');
    });

    it('returns undefined without a cookie', async () => {
      await expect(
        jwtServerPolicy.getSessionKey(buildRequest())
      ).resolves.toBeUndefined();
    });
  });
});
