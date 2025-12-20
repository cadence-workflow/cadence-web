import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import {
  CADENCE_AUTH_COOKIE_NAME,
  decodeCadenceJwtClaims,
  getDomainAccessForUser,
  getPublicAuthContext,
  getGrpcMetadataFromAuth,
  resolveAuthContext,
} from '@/utils/auth/auth-context';
import getConfigValue from '@/utils/config/get-config-value';

jest.mock('@/utils/config/get-config-value');

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const buildToken = (claims: Record<string, unknown>) => {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

const buildTokenWithNonJsonPayload = (payloadText: string) => {
  const payload = Buffer.from(payloadText).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

describe('auth-context utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(resolveAuthContext.name, () => {
    it('returns unauthenticated context when RBAC is disabled', async () => {
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'false';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: () => undefined,
      });

      expect(authContext).toMatchObject({
        rbacEnabled: false,
        isAdmin: false,
        token: undefined,
        groups: [],
      });
    });

    it('prefers cookie token when RBAC is enabled', async () => {
      const token = buildToken({
        name: 'cookie-user',
        groups: ['worker'],
        Admin: true,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        rbacEnabled: true,
        isAdmin: true,
        token,
        groups: ['worker'],
        userName: 'cookie-user',
      });
    });

    it('returns unauthenticated context when cookie is missing', async () => {
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: () => undefined,
      });

      expect(authContext).toMatchObject({
        rbacEnabled: true,
        token: undefined,
      });
    });

    it('treats undecodable tokens as unauthenticated', async () => {
      const token = buildTokenWithNonJsonPayload('not-json');
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        rbacEnabled: true,
        token: undefined,
        groups: [],
        isAdmin: false,
        userName: undefined,
      });
    });

    it('treats expired tokens as unauthenticated', async () => {
      const nowMs = 1_700_000_000_000;
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(nowMs);

      const token = buildToken({
        sub: 'expired-user',
        groups: ['worker'],
        Admin: true,
        exp: Math.floor(nowMs / 1000) - 10,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        rbacEnabled: true,
        token: undefined,
        isAdmin: false,
        groups: [],
        userName: undefined,
        expiresAtMs: undefined,
      });

      dateNowSpy.mockRestore();
    });

    it('exposes expiresAtMs for valid tokens', async () => {
      const nowMs = 1_700_000_000_000;
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(nowMs);
      const expSeconds = Math.floor(nowMs / 1000) + 60;

      const token = buildToken({
        sub: 'exp-user',
        exp: expSeconds,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext.expiresAtMs).toBe(expSeconds * 1000);

      dateNowSpy.mockRestore();
    });

    it('handles capitalized Groups claim with comma-separated string', async () => {
      const token = buildToken({
        sub: 'reader',
        Groups: 'readers, auditors',
        Admin: false,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext.groups).toEqual(['readers', 'auditors']);
      expect(authContext.isAdmin).toBe(false);
    });

    it('handles capitalized Groups claim with space-separated string', async () => {
      const token = buildToken({
        sub: 'reader',
        Groups: 'readers auditors',
        Admin: false,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'true';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext.groups).toEqual(['readers', 'auditors']);
      expect(authContext.isAdmin).toBe(false);
    });

    it('still forwards cookie token when RBAC is disabled', async () => {
      const token = buildToken({
        sub: 'legacy-admin',
        Admin: true,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_RBAC_ENABLED') return 'false';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext.token).toBe(token);
      expect(authContext.isAdmin).toBe(true);
    });
  });

  describe(decodeCadenceJwtClaims.name, () => {
    it('returns undefined for invalid tokens', () => {
      expect(decodeCadenceJwtClaims('invalid.token')).toBeUndefined();
    });

    it('decodes valid payloads', () => {
      const claims = { name: 'ben', groups: ['payer'], Admin: true };
      const token = buildToken(claims);

      expect(decodeCadenceJwtClaims(token)).toMatchObject(claims);
    });
  });

  describe(getDomainAccessForUser.name, () => {
    const baseDomain: Domain = {
      id: 'id',
      name: 'test',
      status: 'DOMAIN_STATUS_REGISTERED',
      description: '',
      ownerEmail: '',
      data: {},
      workflowExecutionRetentionPeriod: null,
      badBinaries: null,
      historyArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
      historyArchivalUri: '',
      visibilityArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
      visibilityArchivalUri: '',
      activeClusterName: '',
      clusters: [],
      failoverVersion: '0',
      isGlobalDomain: false,
      failoverInfo: null,
      isolationGroups: null,
      asyncWorkflowConfig: null,
      activeClusters: null,
    };

    it('allows open domains when RBAC is disabled', () => {
      const access = getDomainAccessForUser(baseDomain, {
        rbacEnabled: false,
        isAdmin: false,
        groups: [],
        token: 'abc',
      });

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('allows admin users', () => {
      const access = getDomainAccessForUser(
        { ...baseDomain, data: { READ_GROUPS: '["worker"]' } },
        {
          rbacEnabled: true,
          isAdmin: true,
          groups: [],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('respects read/write groups', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["reader"]',
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['reader'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });

    it('requires group membership for restricted domains even when RBAC is disabled', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["reader"]',
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: false,
          isAdmin: false,
          groups: [],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('grants write access when write group matches', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["reader"]',
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['writer'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('requires write group when only WRITE_GROUPS are defined', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: [],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: false, canWrite: false });
    });

    it('allows write group to read/write when only WRITE_GROUPS are defined', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['writer'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('treats read-only groups as viewers when no write groups are set', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["viewer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['viewer'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });

    it('supports PublicAuthContext for authenticated users', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["reader"]',
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['writer'],
          isAuthenticated: true,
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('parses space-separated groups in domain metadata', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: 'reader viewer',
            WRITE_GROUPS: 'writer',
          },
        },
        {
          rbacEnabled: true,
          isAdmin: false,
          groups: ['writer'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('denies unauthenticated users even for open domains', () => {
      const access = getDomainAccessForUser(baseDomain, {
        rbacEnabled: true,
        isAdmin: false,
        groups: [],
        token: undefined,
      });

      expect(access).toEqual({ canRead: false, canWrite: false });
    });

    it('denies open domains when RBAC is enabled and not authenticated', () => {
      const access = getDomainAccessForUser(baseDomain, {
        rbacEnabled: true,
        isAdmin: false,
        groups: [],
        token: undefined,
      });

      expect(access).toEqual({ canRead: false, canWrite: false });
    });
  });

  describe(getPublicAuthContext.name, () => {
    it('omits private fields but preserves flags', () => {
      const authContext = {
        rbacEnabled: true,
        token: 'secret',
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
      };

      expect(getPublicAuthContext(authContext)).toEqual({
        rbacEnabled: true,
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
        isAuthenticated: true,
      });
    });
  });

  describe(getGrpcMetadataFromAuth.name, () => {
    it('returns metadata when token is present', () => {
      expect(
        getGrpcMetadataFromAuth({
          token: 'abc',
          groups: [],
          isAdmin: false,
          rbacEnabled: true,
        })
      ).toEqual({ 'cadence-authorization': 'abc' });
    });

    it('returns undefined when token is missing', () => {
      expect(
        getGrpcMetadataFromAuth({
          rbacEnabled: true,
          groups: [],
          isAdmin: false,
        })
      ).toBeUndefined();
    });
  });
});
