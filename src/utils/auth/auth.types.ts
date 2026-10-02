import { type z } from 'zod';

import { type AuthStrategyConfigValue } from '@/config/auth/auth-strategy.types';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import { type cadenceJwtClaimsSchema } from './schemas/cadence-jwt-claims-schema';

export type CadenceJwtClaims = z.infer<typeof cadenceJwtClaimsSchema>;

export type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

export type AuthRequest = { cookies: CookieReader; headers: Headers };

export type AuthContext = {
  authEnabled: boolean;
  auth: {
    isValidToken: boolean;
    expiresAtMs?: number;
    canRefresh: boolean;
  };
  isAdmin: boolean;
  userName?: string;
  id?: string;
  pictureUrl?: string;
  /** Group names used for access checks on the server. Not sent to the browser. */
  groups: string[];
};

export type AuthLogoutNotice = 'session-expired' | 'signed-out';

/** Wire shape for GET /api/auth/me. `auth` is an explicit projection of
 * AuthContext.auth — a field added to the context never leaks to the client
 * by accident; groups never leave the server. */
export type AuthMeResponse = {
  authEnabled: boolean;
  authStrategy: AuthStrategyConfigValue;
  auth: { isValidToken: boolean; expiresAtMs?: number; canRefresh?: boolean };
  userName?: string;
  id?: string;
  pictureUrl?: string;
  isAdmin: boolean;
};

export type AuthRecoveryResult =
  | { kind: 'recovered'; expiresAtMs?: number }
  | { kind: 'redirect'; returnTo: string; notice?: AuthLogoutNotice };

export type CookieMutation =
  | { set: { name: string; value: string; maxAge?: number } }
  | { clear: { name: string } };

export type AuthRecovery = {
  result: AuthRecoveryResult;
  /** Cookies to apply. The route writes them; the policy does not. */
  cookieMutations?: CookieMutation[];
  /** Applied instead if cookieMutations fails validation (avoids a partial write). */
  cleanupMutations?: CookieMutation[];
};

export type AuthServerPolicy = {
  resolveAuthContext(request?: AuthRequest): Promise<AuthContext>;
  getGrpcMetadata(
    authContext: AuthContext,
    request?: AuthRequest
  ): GRPCMetadata | undefined | Promise<GRPCMetadata | undefined>;
  getLoginRedirectIfNeeded(
    authContext: AuthContext,
    returnTo: string,
    notice?: AuthLogoutNotice
  ): string | null;
  recoverSession(
    request: AuthRequest,
    ctx: { returnTo?: string; notice?: AuthLogoutNotice }
  ): Promise<AuthRecovery>;
  getSessionKey(request: AuthRequest): Promise<string | undefined>;
};

export type AuthClientPolicy = {
  supportsSessionRecovery: boolean;
  unauthenticatedRemedy: 'login' | 'unavailable';
  login(returnTo?: string): void;
  logout(options?: { notice?: AuthLogoutNotice }): Promise<void>;
  onUnauthorized(response: Response): boolean;
};

/** A server policy, either already constructed or loaded on first use. */
export type AuthServerRegistryEntry = {
  policy: AuthServerPolicy | (() => Promise<AuthServerPolicy>);
  cookieNames: { exact: string[]; prefixes: string[] };
};

/** Registry entry after its policy has been loaded. */
export type ResolvedAuthServerRegistryEntry = {
  policy: AuthServerPolicy;
  cookieNames: { exact: string[]; prefixes: string[] };
};
