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
