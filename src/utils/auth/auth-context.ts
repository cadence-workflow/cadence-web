import 'server-only';

import { cookies as getRequestCookies } from 'next/headers';

import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import getConfigValue from '../config/get-config-value';

import { type CadenceJwtClaims, type CookieReader } from './auth-context.types';
import { splitGroupList } from './auth-shared';
import {
  type PublicAuthContext,
  type PrivateAuthContext,
} from './auth-shared.types';
import { cadenceJwtClaimsSchema } from './schemas/cadence-jwt-claims-schema';

export const CADENCE_AUTH_COOKIE_NAME = 'cadence-authorization';

export function decodeCadenceJwtClaims(
  token: string
): CadenceJwtClaims | undefined {
  const [, payload] = token.split('.');
  if (!payload) {
    return undefined;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
    const decodedPayload = Buffer.from(paddedPayload, 'base64').toString(
      'utf8'
    );

    const parsed = JSON.parse(decodedPayload);
    const result = cadenceJwtClaimsSchema.safeParse(parsed);
    if (!result.success) {
      return undefined;
    }
    return result.data;
  } catch {
    return undefined;
  }
}

export async function resolveAuthContext(
  cookieStore?: CookieReader
): Promise<PrivateAuthContext> {
  const authStrategy = await getConfigValue('CADENCE_WEB_AUTH_STRATEGY');
  const authEnabled = authStrategy === 'jwt';

  const cookies = cookieStore ?? getRequestCookies();
  const tokenFromCookie = cookies.get(CADENCE_AUTH_COOKIE_NAME)?.value?.trim();
  const token = tokenFromCookie || undefined;

  const claims = token ? decodeCadenceJwtClaims(token) : undefined;
  const isInvalidToken = token !== undefined && claims === undefined;
  const expiresAtMsRaw =
    typeof claims?.exp === 'number' ? claims.exp * 1000 : undefined;
  const isExpired =
    expiresAtMsRaw !== undefined && Date.now() >= expiresAtMsRaw;
  const shouldDropToken = !authEnabled || isInvalidToken || isExpired;
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
    authEnabled,
    auth: {
      isValidToken: Boolean(effectiveToken),
      token: effectiveToken,
      expiresAtMs,
    },
    groups,
    isAdmin,
    userName,
    id,
  };
}

export function getGrpcMetadataFromAuth(
  authContext: PrivateAuthContext | null | undefined
): GRPCMetadata | undefined {
  if (!authContext?.authEnabled || !authContext.auth.token) {
    return undefined;
  }

  return {
    'cadence-authorization': authContext.auth.token,
  };
}

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
