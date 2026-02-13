import 'server-only';

import { cookies as getRequestCookies } from 'next/headers';
import { z } from 'zod';

import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import getConfigValue from '../config/get-config-value';

import {
  splitGroupList,
  type CadenceJwtClaims,
  type PublicAuthContext,
  type UserAuthContext,
} from './auth-shared';

export const CADENCE_AUTH_COOKIE_NAME = 'cadence-authorization';

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

const cadenceJwtClaimsSchema = z
  .object({
    admin: z.boolean().optional(),
    exp: z.number().optional(),
    groups: z.unknown().optional(),
    name: z.string().optional(),
    sub: z.string().optional(),
  })
  .passthrough();

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
    return result.data as CadenceJwtClaims;
  } catch {
    return undefined;
  }
}

export async function resolveAuthContext(
  cookieStore?: CookieReader
): Promise<UserAuthContext> {
  const authStrategy =
    (await getConfigValue('CADENCE_WEB_AUTH_STRATEGY')) ?? 'disabled';
  const authEnabled = authStrategy.toLowerCase() === 'jwt';

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

  const normalizeGroups = (): string[] => {
    const raw = effectiveClaims?.groups;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .flatMap((g) => splitGroupList(typeof g === 'string' ? g : `${g}`))
        .filter(Boolean);
    }
    if (typeof raw === 'string') {
      return splitGroupList(raw);
    }
    return [];
  };
  const groups = normalizeGroups();
  const id =
    (typeof effectiveClaims?.sub === 'string' && effectiveClaims.sub) ||
    (typeof effectiveClaims?.name === 'string' && effectiveClaims.name) ||
    undefined;
  const userName =
    (typeof effectiveClaims?.name === 'string' && effectiveClaims.name) ||
    (typeof effectiveClaims?.sub === 'string' && effectiveClaims.sub) ||
    undefined;
  const isAdmin = effectiveClaims?.admin === true;

  return {
    authEnabled,
    token: effectiveToken,
    groups,
    isAdmin,
    userName,
    id,
    expiresAtMs,
  };
}

export function getGrpcMetadataFromAuth(
  authContext: UserAuthContext | null | undefined
): GRPCMetadata | undefined {
  if (!authContext?.authEnabled || !authContext.token) {
    return undefined;
  }

  return {
    'cadence-authorization': authContext.token,
  };
}

export const getPublicAuthContext = (
  authContext: UserAuthContext
): PublicAuthContext => ({
  authEnabled: authContext.authEnabled,
  groups: authContext.groups,
  isAdmin: authContext.isAdmin,
  userName: authContext.userName,
  id: authContext.id,
  ...(typeof authContext.expiresAtMs === 'number'
    ? { expiresAtMs: authContext.expiresAtMs }
    : {}),
  isAuthenticated: Boolean(authContext.token),
});

export { getDomainAccessForUser } from './auth-shared';
export type {
  CadenceJwtClaims,
  PublicAuthContext,
  UserAuthContext,
} from './auth-shared';
