import 'server-only';

import { type AuthContext, type AuthRequest } from './auth.types';
import getActiveAuthServerEntry from './strategies/get-active-auth-server-entry';

/**
 * Resolves the auth context using the active strategy's server policy.
 * If no request is passed, the policy decides how to get one. It may read it
 * implicitly, which can throw outside a request scope, or not need one at all.
 */
export async function resolveAuthContext(
  request?: AuthRequest
): Promise<AuthContext> {
  const entry = await getActiveAuthServerEntry();
  return entry.policy.resolveAuthContext(request);
}
