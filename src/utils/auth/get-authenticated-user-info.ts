import 'server-only';

import getConfigValue from '@/utils/config/get-config-value';

import { type AuthRequest } from './auth.types';
import { type AuthenticatedUserInfo } from './get-authenticated-user-info.types';

/**
 * Identity for `/api/auth/me`.
 *
 * TODO: replace this body with the Cadence WhoAmI RPC and cluster failover.
 * Identity must come from the backend, not headers.
 */
export default async function getAuthenticatedUserInfo(
  _request: AuthRequest
): Promise<AuthenticatedUserInfo | null> {
  const config = await getConfigValue('TRUSTED_HEADER_AUTH_CONFIG');
  if (!config) {
    return null;
  }

  // Temporary fake response with the shape expected from Cadence WhoAmI.
  return {
    id: 'trusted-header-user',
    userName: 'Trusted Header User',
    isAdmin: false,
    groups: [],
  };
}
