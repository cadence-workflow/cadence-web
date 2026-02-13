import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type CadenceJwtClaims = {
  admin?: boolean;
  exp?: number;
  groups?: unknown;
  name?: string;
  sub?: string;
};

type BaseAuthContext = {
  authEnabled: boolean;
  groups: string[];
  isAdmin: boolean;
  userName?: string;
  id?: string;
  expiresAtMs?: number;
};

export type PublicAuthContext = BaseAuthContext & {
  isAuthenticated: boolean;
};

export type UserAuthContext = BaseAuthContext & {
  token?: string;
};

export const splitGroupList = (raw: string) =>
  raw
    .split(/[,\s]+/g)
    .map((g) => g.trim())
    .filter((g) => g.length > 0);

const parseGroups = (rawValue?: string) => {
  if (!rawValue) return [] as string[];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed
        .flatMap((item) => splitGroupList(`${item}`.trim()))
        .filter((item) => item.length > 0);
    }
  } catch {
    // fall through to comma split
  }
  return splitGroupList(rawValue);
};

const getDomainDataValue = (domain: Domain, keys: string[]) => {
  for (const key of keys) {
    const value = domain.data?.[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

export const getDomainAccessForUser = (
  domain: Domain,
  authContext: UserAuthContext | PublicAuthContext | null | undefined
) => {
  if (!authContext?.authEnabled) {
    return {
      canRead: true,
      canWrite: true,
    };
  }

  const isAuthenticated =
    typeof (authContext as PublicAuthContext | undefined)?.isAuthenticated ===
    'boolean'
      ? (authContext as PublicAuthContext).isAuthenticated
      : Boolean((authContext as UserAuthContext | undefined)?.token);

  if (authContext?.isAdmin) {
    return {
      canRead: true,
      canWrite: true,
    };
  }

  if (!isAuthenticated) {
    return {
      canRead: false,
      canWrite: false,
    };
  }

  const readGroups = parseGroups(
    getDomainDataValue(domain, ['READ_GROUPS', 'read_groups', 'readGroups'])
  );
  const writeGroups = parseGroups(
    getDomainDataValue(domain, ['WRITE_GROUPS', 'write_groups', 'writeGroups'])
  );

  const userGroups = authContext?.groups ?? [];
  if (readGroups.length === 0 && writeGroups.length === 0) {
    return {
      canRead: false,
      canWrite: false,
    };
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
