import { type z } from 'zod';

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
    /** Whether this session holds usable refresh material; drives the client
     * session-recovery UI. */
    canRefresh: boolean;
  };
  /** UI badge only — never an authorization input. */
  isAdmin: boolean;
  userName?: string;
  id?: string;
  pictureUrl?: string;
  /** Server-only — never serialized to the browser; the /api/auth/me
   * projection excludes it. `[]` when the claim/header is absent. */
  groups: string[];
};

export type AuthLogoutNotice = 'session-expired' | 'signed-out';

export type AuthRecoveryResult =
  | { kind: 'recovered'; expiresAtMs?: number }
  | { kind: 'redirect'; returnTo: string; notice?: AuthLogoutNotice };

export type CookieMutation =
  | { set: { name: string; value: string; maxAge?: number } }
  | { clear: { name: string } };

export type AuthRecovery = {
  result: AuthRecoveryResult;
  /** Declarative cookie write set — policies stay pure; the route validates
   * (name allowlist + byte budget) and replays it onto the response. */
  cookieMutations?: CookieMutation[];
  /** Clears the route replays instead when the write set fails validation. */
  cleanupMutations?: CookieMutation[];
};

export type AuthServerPolicy = {
  /** No-arg form reads the request implicitly via next/headers; throws
   * outside a request scope. */
  resolveAuthContext(request?: AuthRequest): Promise<AuthContext>;
  /** Outbound credential metadata, or undefined when there is nothing to
   * forward. Implementations may be async. */
  getGrpcMetadata(
    authContext: AuthContext,
    request?: AuthRequest
  ): GRPCMetadata | undefined | Promise<GRPCMetadata | undefined>;
  /** The login path to navigate to when the context is invalid, else null. */
  getLoginRedirectIfNeeded(
    authContext: AuthContext,
    returnTo: string,
    notice?: AuthLogoutNotice
  ): string | null;
  /** Pure — no side effects; the route validates and replays the returned
   * mutations. MUST first evaluate the credential the request already
   * carries: when still fresh, return {kind:'recovered'} with no mutations
   * and run no grant. */
  recoverSession(
    request: AuthRequest,
    ctx: { returnTo?: string; notice?: AuthLogoutNotice }
  ): Promise<AuthRecovery>;
  /** Stable per-session identifier. Server-only. */
  getSessionKey(request: AuthRequest): Promise<string | undefined>;
};

export type AuthClientPolicy = {
  /** Drives the client session-expiry warning. */
  supportsSessionRecovery: boolean;
  /** Where an unauthenticated user is sent: the login page or the
   * /auth-unavailable status page. */
  unauthenticatedRemedy: 'login' | 'unavailable';
  /** Login/logout menu labels, for strategies that render auth menu items. */
  labels?: { login: string; logout: string };
  login(returnTo?: string): void;
  logout(options?: { notice?: AuthLogoutNotice }): Promise<void>;
  /** Whether the 401 pipeline may attempt recovery for this response. */
  onUnauthorized(response: Response): boolean;
};

/** Registry entry: owns the cookie-name declarations the mutation validator
 * consumes. The policy may be a lazy loader so unselected strategies stay
 * out of the boot path. */
export type AuthServerRegistryEntry = {
  policy: AuthServerPolicy | (() => Promise<AuthServerPolicy>);
  cookieNames: { exact: string[]; prefixes: string[] };
};

/** The entry after its lazy loader has been awaited — what
 * getActiveAuthServerEntry returns. */
export type ResolvedAuthServerRegistryEntry = {
  policy: AuthServerPolicy;
  cookieNames: { exact: string[]; prefixes: string[] };
};
