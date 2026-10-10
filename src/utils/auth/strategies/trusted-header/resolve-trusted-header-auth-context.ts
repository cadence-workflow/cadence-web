import 'server-only';

import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';
import getAuthenticatedUserInfo from '@/utils/auth/get-authenticated-user-info';

const UNAUTHENTICATED_CONTEXT: AuthContext = {
  authEnabled: true,
  auth: { isValidToken: false, canRefresh: false },
  isAdmin: false,
  groups: [],
};

/**
 * trusted-header context comes from the identity adapter, not headers. The
 * adapter is the seam for the Cadence WhoAmI RPC. Trust that the perimeter
 * strips forwarded headers is enforced where the metadata map is applied.
 */
export default async function resolveTrustedHeaderAuthContext(
  request: AuthRequest
): Promise<AuthContext> {
  const info = await getAuthenticatedUserInfo(request);
  if (!info) {
    return UNAUTHENTICATED_CONTEXT;
  }

  return {
    authEnabled: true,
    auth: { isValidToken: true, canRefresh: false },
    isAdmin: info.isAdmin,
    groups: [],
    id: info.id,
    userName: info.userName,
    email: info.email,
    pictureUrl: info.pictureUrl,
  };
}
