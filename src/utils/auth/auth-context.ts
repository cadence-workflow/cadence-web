import 'server-only';

import { cookies as getRequestCookies } from 'next/headers';

import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import getConfigValue from '../config/get-config-value';

import {
  type AuthTokenSource,
  type CadenceJwtClaims,
  type PublicAuthContext,
  type UserAuthContext,
} from './auth-shared';

export const CADENCE_AUTH_COOKIE_NAME = 'cadence-authorization';

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

const parseBooleanFlag = (value: string) =>
  value?.toLowerCase() === 'true' || value === '1';

const splitGroupList = (raw: string) =>
  raw
    .split(/[,\s]+/g)
    .map((g) => g.trim())
    .filter(Boolean);

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

    return JSON.parse(decodedPayload) as CadenceJwtClaims;
  } catch {
    return undefined;
  }
}

export async function resolveAuthContext(
  cookieStore?: CookieReader
): Promise<UserAuthContext> {
  const rbacEnabled = parseBooleanFlag(
    (await getConfigValue('CADENCE_WEB_RBAC_ENABLED')) ?? 'false'
  );

  const cookies = cookieStore ?? getRequestCookies();
  const tokenFromCookie = cookies.get(CADENCE_AUTH_COOKIE_NAME)?.value?.trim();
  const envToken = (await getConfigValue('CADENCE_WEB_JWT_TOKEN'))?.trim();

  const token = tokenFromCookie || envToken || undefined;
  const tokenSource: AuthTokenSource | undefined = tokenFromCookie
    ? 'cookie'
    : envToken
      ? 'env'
      : undefined;

  const claims = token ? decodeCadenceJwtClaims(token) : undefined;
  const normalizeGroups = (): string[] => {
    const raw =
      (claims as Record<string, unknown> | undefined)?.groups ??
      (claims as Record<string, unknown> | undefined)?.Groups;
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
  const userName =
    (claims?.name && typeof claims.name === 'string' && claims.name) ||
    (claims?.sub && typeof claims.sub === 'string' && claims.sub) ||
    undefined;
  const isAdmin = claims?.Admin === true;

  return {
    rbacEnabled,
    token,
    tokenSource,
    claims,
    groups,
    isAdmin,
    userName,
    id: userName,
  };
}

export function getGrpcMetadataFromAuth(
  authContext: UserAuthContext | null | undefined
): GRPCMetadata | undefined {
  if (!authContext?.token) {
    return undefined;
  }

  return {
    'cadence-authorization': authContext.token,
  };
}

export const getPublicAuthContext = (
  authContext: UserAuthContext
): PublicAuthContext => ({
  rbacEnabled: authContext.rbacEnabled,
  tokenSource: authContext.tokenSource,
  claims: authContext.claims,
  groups: authContext.groups,
  isAdmin: authContext.isAdmin,
  userName: authContext.userName,
  id: authContext.id,
  isAuthenticated: Boolean(authContext.token),
});

export { getDomainAccessForUser } from './auth-shared';
export type {
  AuthTokenSource,
  CadenceJwtClaims,
  PublicAuthContext,
  UserAuthContext,
} from './auth-shared';
