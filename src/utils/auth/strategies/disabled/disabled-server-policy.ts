import 'server-only';

import { type AuthServerPolicy } from '@/utils/auth/auth.types';

const disabledServerPolicy: AuthServerPolicy = {
  resolveAuthContext: () =>
    Promise.resolve({
      authEnabled: false,
      auth: { isValidToken: false, canRefresh: false },
      isAdmin: false,
      groups: [],
    }),
  getGrpcMetadata: () => undefined,
  getLoginRedirectIfNeeded: () => null,
  // Unreachable: the client policy's onUnauthorized is false. A direct call
  // is a bug — fail closed and loud.
  recoverSession: () =>
    Promise.reject(new Error('disabled strategy has no session to recover')),
  getSessionKey: () => Promise.resolve(undefined),
};

export default disabledServerPolicy;
