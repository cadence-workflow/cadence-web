import 'server-only';

import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthServerPolicy } from '@/utils/auth/auth.types';
import getImplicitAuthRequest from '@/utils/auth/helpers/get-implicit-auth-request';
import getConfigValue from '@/utils/config/get-config-value';
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
    // The forwarding gate: identity headers reach the backend only when the
    // web tier's own auth decision is valid — forged credentials change
    // pixels, never permissions.
    if (!authContext.authEnabled || !authContext.auth.isValidToken) {
      return undefined;
    }
    return getTrustedHeaderGrpcMetadata(request ?? getImplicitAuthRequest());
  },

  getLoginRedirectIfNeeded(authContext) {
    // No login page exists for this strategy — an invalid context means the
    // perimeter is misconfigured, so every page redirects to the
    // no-interaction status page (which lives outside the (Home) gate).
    return authContext.auth.isValidToken ? null : AUTH_UNAVAILABLE_PATH;
  },

  // Unreachable: the client policy's onUnauthorized is false. A direct call
  // is a bug — fail closed and loud.
  recoverSession: () =>
    Promise.reject(
      new Error('trusted-header strategy has no session to recover')
    ),

  async getSessionKey(request) {
    // The single designated identity header's raw value, VERBATIM —
    // groups/admin headers never enter the pre-image, or a group change /
    // multi-hop header reformatting would constant-miss the session memo.
    const config = await getConfigValue('TRUSTED_HEADER_AUTH_CONFIG');
    if (!config) {
      return undefined;
    }
    return request.headers.get(config.userIdHeader) ?? undefined;
  },
};

export default trustedHeaderServerPolicy;
