import 'server-only';

import { splitGroupList } from '@/utils/auth/auth-shared';
import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';
import decodeCadenceJwtClaims from '@/utils/auth/helpers/decode-cadence-jwt-claims';

import { CADENCE_AUTH_COOKIE_NAME } from './jwt-auth.constants';

/** Reads the raw JWT cookie — the credential never enters AuthContext.auth;
 * it is reachable only through the policy (getGrpcMetadata/getSessionKey). */
export function getJwtTokenFromRequest(
  request: AuthRequest
): string | undefined {
  return (
    request.cookies.get(CADENCE_AUTH_COOKIE_NAME)?.value?.trim() || undefined
  );
}

export default async function resolveJwtAuthContext(
  request: AuthRequest
): Promise<AuthContext> {
  const token = getJwtTokenFromRequest(request);

  const claims = token ? decodeCadenceJwtClaims(token) : undefined;
  const isInvalidToken = token !== undefined && claims === undefined;
  const expiresAtMsRaw =
    typeof claims?.exp === 'number' ? claims.exp * 1000 : undefined;
  const isExpired =
    expiresAtMsRaw !== undefined && Date.now() >= expiresAtMsRaw;
  const shouldDropToken = isInvalidToken || isExpired;
  const effectiveClaims = shouldDropToken ? undefined : claims;
  const expiresAtMs = shouldDropToken ? undefined : expiresAtMsRaw;
  const effectiveToken = shouldDropToken ? undefined : token;

  const groups = effectiveClaims?.groups
    ? splitGroupList(effectiveClaims.groups)
    : [];
  const id = effectiveClaims?.sub || effectiveClaims?.name || undefined;
  const userName = effectiveClaims?.name || effectiveClaims?.sub || undefined;
  const isAdmin = effectiveClaims?.admin === true;

  return {
    authEnabled: true,
    auth: {
      isValidToken: Boolean(effectiveToken),
      expiresAtMs,
      canRefresh: false,
    },
    groups,
    isAdmin,
    userName,
    id,
  };
}
