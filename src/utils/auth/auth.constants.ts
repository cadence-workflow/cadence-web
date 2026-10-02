import { type AuthLogoutNotice } from './auth.types';

// --- Logout notices ---

export const AUTH_LOGOUT_NOTICES = [
  'signed-out',
  'session-expired',
] as const satisfies readonly AuthLogoutNotice[];

export const AUTH_LOGOUT_NOTICE_SET = new Set<string>(AUTH_LOGOUT_NOTICES);

// --- Login surfaces ---

export const DEFAULT_AUTH_RETURN_TO = '/';

export const JWT_LOGIN_PATH = '/login';

// --- Cadence backend ---

/** gRPC metadata key the Cadence server reads the auth token from */
export const CADENCE_AUTH_GRPC_METADATA_KEY = 'cadence-authorization';

// --- Cookie writing ---

/** shared attribute set for all auth cookies */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
} as const;

/**
 * ~4KB Max bytes for all auth cookie mutations. Shared by all auth strategies
 * but sized for the largest known strategy (the OIDC session).
 */
export const AUTH_COOKIE_MUTATIONS_MAX_BYTES = 4000;
