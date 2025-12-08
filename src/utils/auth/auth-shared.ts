import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type AuthTokenSource = 'cookie' | 'env';

export type CadenceJwtClaims = {
  Admin?: boolean;
  groups?: unknown;
  name?: string;
  sub?: string;
  [key: string]: unknown;
};

type BaseAuthContext = {
  rbacEnabled: boolean;
  tokenSource?: AuthTokenSource;
  claims?: CadenceJwtClaims;
  groups: string[];
  isAdmin: boolean;
  userName?: string;
  id?: string;
};

export type PublicAuthContext = BaseAuthContext & {
  isAuthenticated: boolean;
};

export type UserAuthContext = BaseAuthContext & {
  token?: string;
};

const splitGroupList = (raw: string) =>
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

export const getDomainAccessForUser = (
  domain: Domain,
  authContext: UserAuthContext | PublicAuthContext | null | undefined
) => {
  if (!authContext?.rbacEnabled) {
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
    domain.data?.READ_GROUPS ||
      (domain.data as any)?.read_groups ||
      (domain.data as any)?.readGroups
  );
  const writeGroups = parseGroups(
    domain.data?.WRITE_GROUPS ||
      (domain.data as any)?.write_groups ||
      (domain.data as any)?.writeGroups
  );

  const userGroups = authContext?.groups ?? [];
  const effectiveReadGroups =
    readGroups.length > 0
      ? readGroups
      : writeGroups.length > 0
        ? writeGroups
        : [];

  const hasReadGroup = effectiveReadGroups.some((g) => userGroups.includes(g));
  const hasWriteGroup = writeGroups.some((g) => userGroups.includes(g));

  const readRestricted = effectiveReadGroups.length > 0;
  const writeRestricted = writeGroups.length > 0;

  const canRead = readRestricted ? hasReadGroup || hasWriteGroup : false;
  const canWrite = writeRestricted
    ? hasWriteGroup
    : readRestricted
      ? false
      : false;

  return {
    canRead,
    canWrite,
  };
};
