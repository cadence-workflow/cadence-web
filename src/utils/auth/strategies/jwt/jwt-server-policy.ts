import 'server-only';

import { CADENCE_AUTH_GRPC_METADATA_KEY } from '@/utils/auth/auth.constants';
import { type AuthServerPolicy } from '@/utils/auth/auth.types';
import getImplicitAuthRequest from '@/utils/auth/helpers/get-implicit-auth-request';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';

import getJwtTokenFromRequest from './get-jwt-token-from-request';
import { JWT_AUTH_COOKIE_NAME } from './jwt-auth.constants';
import { buildJwtLoginPath, isJwtLoginReturnTo } from './jwt-login-path';
import resolveJwtAuthContext from './resolve-jwt-auth-context';

const jwtServerPolicy: AuthServerPolicy = {
  resolveAuthContext(request) {
    return resolveJwtAuthContext(request ?? getImplicitAuthRequest());
  },

  getGrpcMetadata(authContext, request) {
    if (!authContext.authEnabled || !authContext.auth.isValidToken) {
      return undefined;
    }
    const token = getJwtTokenFromRequest(request ?? getImplicitAuthRequest());
    if (!token) {
      return undefined;
    }
    return { [CADENCE_AUTH_GRPC_METADATA_KEY]: token };
  },

  getLoginRedirectIfNeeded(authContext, returnTo, notice) {
    if (authContext.auth.isValidToken || isJwtLoginReturnTo(returnTo)) {
      return null;
    }
    return buildJwtLoginPath(returnTo, notice);
  },

  async recoverSession(request, ctx) {
    const authContext = await resolveJwtAuthContext(request);
    // A still-valid JWT is left in place: another tab may have signed in again.
    if (authContext.auth.isValidToken) {
      return {
        result: {
          kind: 'recovered' as const,
          ...(authContext.auth.expiresAtMs !== undefined
            ? { expiresAtMs: authContext.auth.expiresAtMs }
            : {}),
        },
      };
    }
    // An invalid or missing JWT is cleared, and the caller is sent to the login page.
    return {
      result: {
        kind: 'redirect' as const,
        returnTo: sanitizeReturnTo(ctx.returnTo),
        ...(ctx.notice ? { notice: ctx.notice } : {}),
      },
      cookieMutations: [{ clear: { name: JWT_AUTH_COOKIE_NAME } }],
    };
  },

  getSessionKey(request) {
    return Promise.resolve(getJwtTokenFromRequest(request));
  },
};

export default jwtServerPolicy;
