import 'server-only';

import { JWT_LOGIN_PATH } from '@/utils/auth/auth.constants';
import { type AuthServerPolicy } from '@/utils/auth/auth.types';
import getImplicitAuthRequest from '@/utils/auth/helpers/get-implicit-auth-request';

import buildJwtLoginPath from './build-jwt-login-path';
import {
  CADENCE_AUTH_COOKIE_NAME,
  CADENCE_AUTH_GRPC_METADATA_KEY,
} from './jwt-auth.constants';
import resolveJwtAuthContext, {
  getJwtTokenFromRequest,
} from './resolve-jwt-auth-context';

function isJwtLoginReturnTo(returnTo: string): boolean {
  return (
    returnTo === JWT_LOGIN_PATH || returnTo.startsWith(`${JWT_LOGIN_PATH}?`)
  );
}

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

  // jwt has no silent grant: recovery is a redirect to the login page plus a
  // clear of the dead credential. The freshness early return is the
  // contract's MUST: a sibling tab may already have re-authenticated —
  // never clear a live credential.
  async recoverSession(request, ctx) {
    const authContext = await resolveJwtAuthContext(request);
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
    return {
      result: {
        kind: 'redirect' as const,
        returnTo: ctx.returnTo ?? '/',
        ...(ctx.notice ? { notice: ctx.notice } : {}),
      },
      cookieMutations: [{ clear: { name: CADENCE_AUTH_COOKIE_NAME } }],
    };
  },

  getSessionKey(request) {
    return Promise.resolve(getJwtTokenFromRequest(request));
  },
};

export default jwtServerPolicy;
