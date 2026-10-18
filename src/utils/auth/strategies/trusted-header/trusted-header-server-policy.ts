import 'server-only';

import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthServerPolicy } from '@/utils/auth/auth.types';
import getAuthenticatedUserInfo from '@/utils/auth/get-authenticated-user-info';
import getImplicitAuthRequest from '@/utils/auth/helpers/get-implicit-auth-request';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import getTrustedHeaderGrpcMetadata from './get-trusted-header-grpc-metadata';
import resolveTrustedHeaderAuthContext from './resolve-trusted-header-auth-context';

const trustedHeaderServerPolicy: AuthServerPolicy = {
  async resolveAuthContext(request) {
    return resolveTrustedHeaderAuthContext(
      request ?? (await getImplicitAuthRequest())
    );
  },

  async getGrpcMetadata(
    authContext,
    request
  ): Promise<GRPCMetadata | undefined> {
    if (!authContext.authEnabled || !authContext.auth.isValidToken) {
      return undefined;
    }
    return getTrustedHeaderGrpcMetadata(
      request ?? (await getImplicitAuthRequest())
    );
  },

  getLoginRedirectIfNeeded(authContext) {
    // No login form exists for this strategy. An invalid context means the
    // perimeter is misconfigured, so pages redirect to the unavailable status page.
    return authContext.auth.isValidToken ? null : AUTH_UNAVAILABLE_PATH;
  },

  // Unreachable while onUnauthorized is false. Calling this is a bug.
  recoverSession: () =>
    Promise.reject(
      new Error('trusted-header strategy has no session to recover')
    ),

  async getSessionKey(request) {
    const info = await getAuthenticatedUserInfo(request);
    return info?.id;
  },
};

export default trustedHeaderServerPolicy;
