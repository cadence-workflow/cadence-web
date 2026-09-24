import 'server-only';

import {
  type PrivateAuthContext,
  type PublicAuthContext,
} from './auth-shared.types';
import { type AuthContext, type AuthRequest } from './auth.types';
import getActiveAuthServerEntry from './strategies/get-active-auth-server-entry';

/**
 * Resolves the request's auth context through the active strategy's server
 * policy (the registry owns per-strategy behavior; this module is
 * strategy-agnostic plumbing). No-arg form reads the request implicitly via
 * next/headers and THROWS outside a request scope.
 */
export async function resolveAuthContext(
  request?: AuthRequest
): Promise<AuthContext> {
  const entry = await getActiveAuthServerEntry();
  return entry.policy.resolveAuthContext(request);
}

// Compatibility alias (removed when the /api/auth/me reshape lands): the
// `me` projection over the alias types (auth-shared.types.ts). The
// registry-dispatched AuthContext is structurally assignable to
// PrivateAuthContext, so the `me` route keeps its exact master behavior.
export const getPublicAuthContext = ({
  auth,
  ...publicFields
}: PrivateAuthContext): PublicAuthContext => ({
  ...publicFields,
  auth: {
    isValidToken: auth.isValidToken,
    expiresAtMs: auth.expiresAtMs,
  },
});
