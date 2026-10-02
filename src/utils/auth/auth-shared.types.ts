// Compatibility aliases (removed when the /api/auth/me reshape lands):
// the pre-registry context types, kept so untouched callers compile against
// the registry-dispatched AuthContext (auth.types.ts), which is structurally
// assignable to them.
export type PublicAuthState = {
  isValidToken: boolean;
  expiresAtMs?: number;
};

export type PrivateAuthState = PublicAuthState & {
  token?: string;
};

export type BaseAuthContext = {
  authEnabled: boolean;
  auth: PublicAuthState;
  groups: string[];
  isAdmin: boolean;
  userName?: string;
  id?: string;
};

export type PublicAuthContext = BaseAuthContext;

export type PrivateAuthContext = BaseAuthContext & {
  auth: PrivateAuthState;
};

export type DomainAccess = {
  canRead: boolean;
  canWrite: boolean;
};
