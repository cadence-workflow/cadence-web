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
    canRefresh: boolean;
  };
  isAdmin: boolean;
  userName?: string;
  id?: string;
  pictureUrl?: string;
  /** Server-only; never sent to the browser.
   * TODO: remove when the backend permissions contract lands. */
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
  labels?: { login: string; logout: string };
  login(returnTo?: string): void;
  logout(options?: { notice?: AuthLogoutNotice }): Promise<void>;
  onUnauthorized(response: Response): boolean;
};

/** allows lazy loading of policies */
export type AuthServerRegistryEntry = {
  policy: AuthServerPolicy | (() => Promise<AuthServerPolicy>);
  cookieNames: { exact: string[]; prefixes: string[] };
};

/** same as AuthServerRegistryEntry, with the policy already loaded */
export type ResolvedAuthServerRegistryEntry = {
  policy: AuthServerPolicy;
  cookieNames: { exact: string[]; prefixes: string[] };
};
