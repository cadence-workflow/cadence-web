import { getMockAuthContext } from '@/utils/auth/__fixtures__/mock-auth-context';
import { DEFAULT_AUTH_RETURN_TO } from '@/utils/auth/auth.constants';

import { getMockJwtAuthRequest } from '../__fixtures__/mock-jwt-auth-request';
import { JWT_AUTH_COOKIE_NAME } from '../jwt-auth.constants';
import jwtServerPolicy from '../jwt-server-policy';

describe('jwtServerPolicy', () => {
  describe('getGrpcMetadata', () => {
    it('returns the cadence-authorization metadata for a valid context', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          getMockAuthContext(),
          getMockJwtAuthRequest('abc')
        )
      ).toEqual({ 'cadence-authorization': 'abc' });
    });

    it('returns undefined when the context is invalid even if a token is present', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          getMockAuthContext({
            auth: { isValidToken: false, canRefresh: false },
          }),
          getMockJwtAuthRequest('abc')
        )
      ).toBeUndefined();
    });

    it('returns undefined when auth is disabled', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          getMockAuthContext({ authEnabled: false }),
          getMockJwtAuthRequest('abc')
        )
      ).toBeUndefined();
    });

    it('returns undefined when the cookie is gone', () => {
      expect(
        jwtServerPolicy.getGrpcMetadata(
          getMockAuthContext(),
          getMockJwtAuthRequest()
        )
      ).toBeUndefined();
    });
  });

  describe('getLoginRedirectIfNeeded', () => {
    it('returns null for a valid context', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          getMockAuthContext(),
          '/domains'
        )
      ).toBeNull();
    });

    it('redirects to /login with a sanitized returnTo and notice', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          getMockAuthContext({
            auth: { isValidToken: false, canRefresh: false },
          }),
          '/domains/foo',
          'session-expired'
        )
      ).toBe(
        `/login?notice=session-expired&returnTo=${encodeURIComponent('/domains/foo')}`
      );
    });

    it('never loops onto the login page itself', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          getMockAuthContext({
            auth: { isValidToken: false, canRefresh: false },
          }),
          '/login?returnTo=%2Fdomains'
        )
      ).toBeNull();
    });

    it('sanitizes protocol-relative returnTo values', () => {
      expect(
        jwtServerPolicy.getLoginRedirectIfNeeded(
          getMockAuthContext({
            auth: { isValidToken: false, canRefresh: false },
          }),
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
        jwtServerPolicy.recoverSession(getMockJwtAuthRequest(token), {
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
        jwtServerPolicy.recoverSession(getMockJwtAuthRequest(token), {})
      ).resolves.toEqual({
        result: { kind: 'redirect', returnTo: DEFAULT_AUTH_RETURN_TO },
        cookieMutations: [{ clear: { name: JWT_AUTH_COOKIE_NAME } }],
      });
    });

    it('returns the redirect outcome with a clear mutation for the jwt cookie', async () => {
      await expect(
        jwtServerPolicy.recoverSession(getMockJwtAuthRequest('abc'), {
          returnTo: '/domains/foo',
          notice: 'session-expired',
        })
      ).resolves.toEqual({
        result: {
          kind: 'redirect',
          returnTo: '/domains/foo',
          notice: 'session-expired',
        },
        cookieMutations: [{ clear: { name: JWT_AUTH_COOKIE_NAME } }],
      });
    });

    it('defaults returnTo to the shared auth return path', async () => {
      await expect(
        jwtServerPolicy.recoverSession(getMockJwtAuthRequest('abc'), {})
      ).resolves.toMatchObject({
        result: { kind: 'redirect', returnTo: DEFAULT_AUTH_RETURN_TO },
      });
    });

    it('sanitizes protocol-relative returnTo values', async () => {
      await expect(
        jwtServerPolicy.recoverSession(getMockJwtAuthRequest('abc'), {
          returnTo: '//evil.test',
        })
      ).resolves.toMatchObject({
        result: { kind: 'redirect', returnTo: DEFAULT_AUTH_RETURN_TO },
      });
    });
  });

  describe('getSessionKey', () => {
    it('returns the raw token', async () => {
      await expect(
        jwtServerPolicy.getSessionKey(getMockJwtAuthRequest('abc'))
      ).resolves.toBe('abc');
    });

    it('returns undefined without a cookie', async () => {
      await expect(
        jwtServerPolicy.getSessionKey(getMockJwtAuthRequest())
      ).resolves.toBeUndefined();
    });
  });
});
