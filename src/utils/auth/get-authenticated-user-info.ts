import 'server-only';

import getConfigValue from '@/utils/config/get-config-value';

import { type AuthRequest } from './auth.types';
import { type AuthenticatedUserInfo } from './get-authenticated-user-info.types';

/**
 * Identity for `/api/auth/me`.
 *
 * TODO: replace this body with the Cadence WhoAmI RPC and cluster failover.
 * The configured user-id header is only a fallback until that RPC exists.
 * Name, email, groups, and admin must come from the backend, not headers.
 */
export default async function getAuthenticatedUserInfo(
  request: AuthRequest
): Promise<AuthenticatedUserInfo | null> {
  const config = await getConfigValue('TRUSTED_HEADER_AUTH_CONFIG');
  if (!config) {
    return null;
  }

  const id = request.headers.get(config.userIdHeader)?.trim();
  if (!id) {
    return null;
  }

  return {
    id,
    userName: id,
    isAdmin: false,
    groups: [],
  };
}
