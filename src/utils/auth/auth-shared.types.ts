export type BaseAuthContext = {
  authEnabled: boolean;
  auth: {
    isValidToken: boolean;
    expiresAtMs?: number;
  };
  groups: string[];
  isAdmin: boolean;
  userName?: string;
  id?: string;
};

export type DomainAccess = {
  canRead: boolean;
  canWrite: boolean;
};
