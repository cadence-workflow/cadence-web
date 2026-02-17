import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type BaseAuthContext = {
  authEnabled: boolean;
  isAuthenticated: boolean;
  groups: string[];
  isAdmin: boolean;
  userName?: string;
  id?: string;
  expiresAtMs?: number;
};

export type PublicAuthContext = BaseAuthContext;

export type PrivateAuthContext = BaseAuthContext & {
  token?: string;
};

export type DomainAccess = {
  canRead: boolean;
  canWrite: boolean;
};

export const FULL_ACCESS: DomainAccess = {
  canRead: true,
  canWrite: true,
};

export const NO_ACCESS: DomainAccess = {
  canRead: false,
  canWrite: false,
};

export const splitGroupList = (raw: string) =>
  raw
    .split(/[,\s]+/g)
    .map((g) => g.trim())
    .filter((g) => g.length > 0);

export const getDomainAccessForUser = (
  domain: Domain,
  authContext: BaseAuthContext | null | undefined
): DomainAccess => {
  if (!authContext?.authEnabled) {
    return FULL_ACCESS;
  }

  if (authContext.isAdmin) {
    return FULL_ACCESS;
  }

  if (!authContext.isAuthenticated) {
    return NO_ACCESS;
  }

  const readGroups = splitGroupList(domain.data?.READ_GROUPS ?? '');
  const writeGroups = splitGroupList(domain.data?.WRITE_GROUPS ?? '');

  const userGroups = authContext.groups;
  if (readGroups.length === 0 && writeGroups.length === 0) {
    return NO_ACCESS;
  }

  const effectiveReadGroups = readGroups.length > 0 ? readGroups : writeGroups;
  const hasWriteGroup = writeGroups.some((g) => userGroups.includes(g));
  const hasReadGroup = effectiveReadGroups.some((g) => userGroups.includes(g));

  const canRead = hasReadGroup || hasWriteGroup;
  const canWrite = writeGroups.length > 0 ? hasWriteGroup : false;

  return {
    canRead,
    canWrite,
  };
};
