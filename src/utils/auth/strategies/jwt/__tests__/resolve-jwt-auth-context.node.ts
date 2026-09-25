import { type AuthRequest } from '@/utils/auth/auth.types';

import { CADENCE_AUTH_COOKIE_NAME } from '../jwt-auth.constants';
import resolveJwtAuthContext, {
  getJwtTokenFromRequest,
} from '../resolve-jwt-auth-context';

const buildToken = (claims: Record<string, unknown>) => {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

const buildTokenWithNonJsonPayload = (payloadText: string) => {
  const payload = Buffer.from(payloadText).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

const buildRequest = (token?: string): AuthRequest => ({
  cookies: {
    get: (name: string) =>
      name === CADENCE_AUTH_COOKIE_NAME && token !== undefined
        ? { value: token }
        : undefined,
  },
  headers: new Headers(),
});

describe(resolveJwtAuthContext.name, () => {
  it('resolves a valid token into the context, without exposing it', async () => {
    const token = buildToken({
      sub: 'cookie-user-id',
      name: 'cookie-user',
      groups: 'worker',
      admin: true,
    });

    const authContext = await resolveJwtAuthContext(buildRequest(token));

    expect(authContext).toEqual({
      authEnabled: true,
      auth: {
        isValidToken: true,
        expiresAtMs: undefined,
        canRefresh: false,
      },
      isAdmin: true,
      groups: ['worker'],
      userName: 'cookie-user',
      id: 'cookie-user-id',
      pictureUrl: undefined,
    });
  });

  it('returns an invalid context when the cookie is missing', async () => {
    const authContext = await resolveJwtAuthContext(buildRequest());

    expect(authContext).toMatchObject({
      authEnabled: true,
      auth: { isValidToken: false, canRefresh: false },
      groups: [],
      isAdmin: false,
    });
  });

  it('treats undecodable tokens as unauthenticated', async () => {
    const authContext = await resolveJwtAuthContext(
      buildRequest(buildTokenWithNonJsonPayload('not-json'))
    );

    expect(authContext).toMatchObject({
      authEnabled: true,
      auth: { isValidToken: false },
      groups: [],
      isAdmin: false,
      userName: undefined,
    });
  });

  it('treats empty-claims tokens as unauthenticated', async () => {
    const authContext = await resolveJwtAuthContext(
      buildRequest(buildToken({}))
    );

    expect(authContext.auth.isValidToken).toBe(false);
  });

  it('treats expired tokens as unauthenticated', async () => {
    const nowMs = 1_700_000_000_000;
    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(nowMs);

    const token = buildToken({
      sub: 'expired-user',
      groups: 'worker',
      admin: true,
      exp: Math.floor(nowMs / 1000) - 10,
    });

    const authContext = await resolveJwtAuthContext(buildRequest(token));

    expect(authContext).toMatchObject({
      authEnabled: true,
      auth: { isValidToken: false, expiresAtMs: undefined },
      isAdmin: false,
      groups: [],
      userName: undefined,
    });

    dateNowSpy.mockRestore();
  });

  it('exposes expiresAtMs for valid tokens', async () => {
    const nowMs = 1_700_000_000_000;
    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(nowMs);
    const expSeconds = Math.floor(nowMs / 1000) + 60;

    const authContext = await resolveJwtAuthContext(
      buildRequest(buildToken({ sub: 'exp-user', exp: expSeconds }))
    );

    expect(authContext.auth.expiresAtMs).toBe(expSeconds * 1000);

    dateNowSpy.mockRestore();
  });
});

describe(getJwtTokenFromRequest.name, () => {
  it('returns the trimmed token', () => {
    expect(getJwtTokenFromRequest(buildRequest('  abc  '))).toBe('abc');
  });

  it('returns undefined when the cookie is absent or blank', () => {
    expect(getJwtTokenFromRequest(buildRequest())).toBeUndefined();
    expect(getJwtTokenFromRequest(buildRequest('   '))).toBeUndefined();
  });
});
