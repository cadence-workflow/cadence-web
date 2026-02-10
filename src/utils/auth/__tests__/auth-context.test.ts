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
    it('returns unauthenticated context when auth is disabled', async () => {
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'disabled';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: () => undefined,
      });

      expect(authContext).toMatchObject({
        authEnabled: false,
        isAdmin: false,
        token: undefined,
        groups: [],
      });
    });

    it('prefers cookie token when auth is enabled', async () => {
      const token = buildToken({
        sub: 'cookie-user-id',
        name: 'cookie-user',
        groups: ['worker'],
        admin: true,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        authEnabled: true,
        isAdmin: true,
        token,
        groups: ['worker'],
        userName: 'cookie-user',
        id: 'cookie-user-id',
      });
    });

    it('returns unauthenticated context when cookie is missing', async () => {
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: () => undefined,
      });

      expect(authContext).toMatchObject({
        authEnabled: true,
        token: undefined,
      });
    });

    it('treats undecodable tokens as unauthenticated', async () => {
      const token = buildTokenWithNonJsonPayload('not-json');
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        authEnabled: true,
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
        admin: true,
        exp: Math.floor(nowMs / 1000) - 10,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext).toMatchObject({
        authEnabled: true,
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
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
        return '';
      });

      const authContext = await resolveAuthContext({
        get: (name: string) =>
          name === CADENCE_AUTH_COOKIE_NAME ? { value: token } : undefined,
      });

      expect(authContext.expiresAtMs).toBe(expSeconds * 1000);

      dateNowSpy.mockRestore();
    });

    it('still forwards cookie token when auth is disabled', async () => {
      const token = buildToken({
        sub: 'legacy-admin',
        admin: true,
      });
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'disabled';
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
      const claims = { name: 'test-user', groups: ['group-a'], admin: true };
      const token = buildToken(claims);

      expect(decodeCadenceJwtClaims(token)).toMatchObject(claims);
    });

    it('returns undefined when claim types are invalid', () => {
      const token = buildToken({
        name: 123,
        admin: 'true',
      });

      expect(decodeCadenceJwtClaims(token)).toBeUndefined();
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

    it('allows open domains when auth is disabled', () => {
      const access = getDomainAccessForUser(baseDomain, {
        authEnabled: false,
        isAdmin: false,
        groups: [],
      });

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('allows admin users', () => {
      const access = getDomainAccessForUser(
        { ...baseDomain, data: { READ_GROUPS: '["worker"]' } },
        {
          authEnabled: true,
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
          authEnabled: true,
          isAdmin: false,
          groups: ['reader'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });

    it('allows full access for restricted domains when auth is disabled', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: '["reader"]',
            WRITE_GROUPS: '["writer"]',
          },
        },
        {
          authEnabled: false,
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
          authEnabled: true,
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
          authEnabled: true,
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
          authEnabled: true,
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
          authEnabled: true,
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
          authEnabled: true,
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
          },
        },
        {
          authEnabled: true,
          isAdmin: false,
          groups: ['viewer'],
          token: 'abc',
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });

    it('denies unauthenticated users even for open domains', () => {
      const access = getDomainAccessForUser(baseDomain, {
        authEnabled: true,
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
        authEnabled: true,
        token: 'secret',
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
      };

      expect(getPublicAuthContext(authContext)).toEqual({
        authEnabled: true,
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
        isAuthenticated: true,
        token: undefined,
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
          authEnabled: true,
        })
      ).toEqual({ 'cadence-authorization': 'abc' });
    });

    it('returns undefined when token is missing', () => {
      expect(
        getGrpcMetadataFromAuth({
          authEnabled: true,
          groups: [],
          isAdmin: false,
        })
      ).toBeUndefined();
    });
  });
});
