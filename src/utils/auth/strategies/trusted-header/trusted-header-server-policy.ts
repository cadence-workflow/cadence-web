import 'server-only';

import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthServerPolicy } from '@/utils/auth/auth.types';
import getAuthenticatedUserInfo from '@/utils/auth/get-authenticated-user-info';
import getImplicitAuthRequest from '@/utils/auth/helpers/get-implicit-auth-request';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import getTrustedHeaderGrpcMetadata from './get-trusted-header-grpc-metadata';
import resolveTrustedHeaderAuthContext from './resolve-trusted-header-auth-context';

const trustedHeaderServerPolicy: AuthServerPolicy = {
  resolveAuthContext(request) {
    return resolveTrustedHeaderAuthContext(request ?? getImplicitAuthRequest());
  },

  async getGrpcMetadata(
    authContext,
    request
  ): Promise<GRPCMetadata | undefined> {
    // Forwarding gate: configured headers reach Cadence only when the web
    // tier's own auth decision is valid — forged headers change pixels,
    // never permissions.
    if (!authContext.authEnabled || !authContext.auth.isValidToken) {
      return undefined;
    }
    return getTrustedHeaderGrpcMetadata(request ?? getImplicitAuthRequest());
  },

  getLoginRedirectIfNeeded(authContext) {
    // No login form exists for this strategy — an invalid context means the
    // perimeter is misconfigured, so pages redirect to the status page.
    return authContext.auth.isValidToken ? null : AUTH_UNAVAILABLE_PATH;
  },

  // Unreachable: the client policy's onUnauthorized is false. A direct call
  // is a bug — fail closed and loud.
  recoverSession: () =>
    Promise.reject(
      new Error('trusted-header strategy has no session to recover')
    ),

  async getSessionKey(request) {
    // Session memo keys on the backend identity, not a header — per-user
    // once the adapter calls Cadence.
    const info = await getAuthenticatedUserInfo(request);
    return info?.id;
  },
};

export default trustedHeaderServerPolicy;
