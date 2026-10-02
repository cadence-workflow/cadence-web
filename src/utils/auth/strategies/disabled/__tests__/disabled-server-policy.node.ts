import { type AuthContext, type AuthRequest } from '../../../auth.types';
import disabledServerPolicy from '../disabled-server-policy';

const AUTH_CONTEXT: AuthContext = {
  authEnabled: false,
  auth: { isValidToken: false, canRefresh: false },
  isAdmin: false,
  groups: [],
};

const REQUEST: AuthRequest = {
  cookies: { get: () => undefined },
  headers: new Headers(),
};

describe('disabledServerPolicy', () => {
  it('resolves an auth-disabled context', async () => {
    await expect(
      disabledServerPolicy.resolveAuthContext(REQUEST)
    ).resolves.toEqual({
      authEnabled: false,
      auth: { isValidToken: false, canRefresh: false },
      isAdmin: false,
      groups: [],
    });
  });

  it('never produces grpc metadata or a login redirect', () => {
    expect(
      disabledServerPolicy.getGrpcMetadata(AUTH_CONTEXT, REQUEST)
    ).toBeUndefined();
    expect(
      disabledServerPolicy.getLoginRedirectIfNeeded(AUTH_CONTEXT, '/domains')
    ).toBeNull();
  });

  it('fails closed and loud on recoverSession (unreachable by design)', async () => {
    await expect(
      disabledServerPolicy.recoverSession(REQUEST, {})
    ).rejects.toThrow('disabled strategy has no session to recover');
  });

  it('has no session key', async () => {
    await expect(
      disabledServerPolicy.getSessionKey(REQUEST)
    ).resolves.toBeUndefined();
  });
});
