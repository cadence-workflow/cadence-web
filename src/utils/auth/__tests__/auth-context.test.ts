import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import {
  getPublicAuthContext,
  resolveAuthContext,
} from '@/utils/auth/auth-context';
import { getDomainAccessForUser } from '@/utils/auth/auth-shared';
import { type AuthRequest } from '@/utils/auth/auth.types';
import { getActiveAuthServerEntry } from '@/utils/auth/strategies/auth-server-registry';
import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/strategies/jwt/jwt-auth.constants';
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

const buildAuthRequest = (token?: string): AuthRequest => ({
  cookies: {
    get: (name: string) =>
      name === CADENCE_AUTH_COOKIE_NAME && token !== undefined
        ? { value: token }
        : undefined,
  },
  headers: new Headers(),
});

const mockAuthStrategy = (strategy: 'jwt' | 'disabled') =>
  mockGetConfigValue.mockImplementation(async (key: string) => {
    if (key === 'CADENCE_WEB_AUTH_STRATEGY') return strategy;
    return '';
  });

describe('auth-context utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Characterization: master's jwt/disabled cases, unchanged in outcome,
  // now exercised through the server-registry dispatch (the active strategy's
  // policy resolves the context). The credential itself no longer enters the
  // context — it is reachable only through the policy, covered by
  // the getGrpcMetadata block below.
  describe(resolveAuthContext.name, () => {
    it('returns unauthenticated context when auth is disabled', async () => {
      mockAuthStrategy('disabled');

      const authContext = await resolveAuthContext({
        cookies: { get: () => undefined },
        headers: new Headers(),
      });

      expect(authContext).toMatchObject({
        authEnabled: false,
        auth: {
          isValidToken: false,
        },
        isAdmin: false,
        groups: [],
      });
    });

    it('prefers cookie token when auth is enabled', async () => {
      const token = buildToken({
        sub: 'cookie-user-id',
        name: 'cookie-user',
        groups: 'worker',
        admin: true,
      });
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext).toMatchObject({
        authEnabled: true,
        auth: {
          isValidToken: true,
        },
        isAdmin: true,
        groups: ['worker'],
        userName: 'cookie-user',
        id: 'cookie-user-id',
      });
    });

    it('returns unauthenticated context when cookie is missing', async () => {
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext({
        cookies: { get: () => undefined },
        headers: new Headers(),
      });

      expect(authContext).toMatchObject({
        authEnabled: true,
        auth: {
          isValidToken: false,
        },
      });
    });

    it('treats undecodable tokens as unauthenticated', async () => {
      const token = buildTokenWithNonJsonPayload('not-json');
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext).toMatchObject({
        authEnabled: true,
        auth: {
          isValidToken: false,
        },
        groups: [],
        isAdmin: false,
        userName: undefined,
      });
    });

    it('treats empty-claims tokens as unauthenticated', async () => {
      const token = buildToken({});
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext).toMatchObject({
        authEnabled: true,
        auth: {
          isValidToken: false,
        },
        groups: [],
        isAdmin: false,
        userName: undefined,
        id: undefined,
      });
    });

    it('treats expired tokens as unauthenticated', async () => {
      const nowMs = 1_700_000_000_000;
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(nowMs);

      const token = buildToken({
        sub: 'expired-user',
        groups: 'worker',
        admin: true,
        exp: Math.floor(nowMs / 1000) - 10,
      });
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext).toMatchObject({
        authEnabled: true,
        auth: {
          isValidToken: false,
          expiresAtMs: undefined,
        },
        isAdmin: false,
        groups: [],
        userName: undefined,
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
      mockAuthStrategy('jwt');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext.auth.expiresAtMs).toBe(expSeconds * 1000);

      dateNowSpy.mockRestore();
    });

    it('ignores cookie token when auth is disabled', async () => {
      const token = buildToken({
        sub: 'legacy-admin',
        admin: true,
      });
      mockAuthStrategy('disabled');

      const authContext = await resolveAuthContext(buildAuthRequest(token));

      expect(authContext.auth.isValidToken).toBe(false);
      expect(authContext.isAdmin).toBe(false);
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

    it('allows admin users', () => {
      const access = getDomainAccessForUser(
        { ...baseDomain, data: { READ_GROUPS: 'worker' } },
        {
          authEnabled: true,
          auth: { isValidToken: true },
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
            READ_GROUPS: 'reader',
            WRITE_GROUPS: 'writer',
          },
        },
        {
          authEnabled: true,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: ['reader'],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });

    it('allows full access for restricted domains when auth is disabled', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: 'reader',
            WRITE_GROUPS: 'writer',
          },
        },
        {
          authEnabled: false,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: [],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('grants write access when write group matches', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: 'reader',
            WRITE_GROUPS: 'writer',
          },
        },
        {
          authEnabled: true,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: ['writer'],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('requires write group when only WRITE_GROUPS are defined', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            WRITE_GROUPS: 'writer',
          },
        },
        {
          authEnabled: true,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: [],
        }
      );

      expect(access).toEqual({ canRead: false, canWrite: false });
    });

    it('allows write group to read/write when only WRITE_GROUPS are defined', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            WRITE_GROUPS: 'writer',
          },
        },
        {
          authEnabled: true,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: ['writer'],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: true });
    });

    it('treats read-only groups as viewers when no write groups are set', () => {
      const access = getDomainAccessForUser(
        {
          ...baseDomain,
          data: {
            READ_GROUPS: 'viewer',
          },
        },
        {
          authEnabled: true,
          auth: { isValidToken: true },
          isAdmin: false,
          groups: ['viewer'],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
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
          auth: { isValidToken: true },
          isAdmin: false,
          groups: ['viewer'],
        }
      );

      expect(access).toEqual({ canRead: true, canWrite: false });
    });
  });

  describe(getPublicAuthContext.name, () => {
    it('omits private fields but preserves flags', () => {
      const authContext = {
        authEnabled: true,
        auth: {
          isValidToken: true,
          token: 'secret',
        },
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
      };

      expect(getPublicAuthContext(authContext)).toEqual({
        authEnabled: true,
        auth: {
          isValidToken: true,
          expiresAtMs: undefined,
        },
        groups: ['worker'],
        isAdmin: true,
        userName: 'worker',
        id: 'worker',
      });
    });
  });

  // Master's getGrpcMetadataFromAuth cases, dispatched through the active
  // strategy's server policy (same metadata key, same credential as master).
  describe('getGrpcMetadata through the active server policy', () => {
    it('returns metadata when token is present', async () => {
      const token = buildToken({ sub: 'user-id' });
      mockAuthStrategy('jwt');

      const request = buildAuthRequest(token);
      const authContext = await resolveAuthContext(request);
      const entry = await getActiveAuthServerEntry();

      // jwt/disabled policies are synchronous; awaiting also satisfies the
      // contract's promise-permissive return type.
      expect(await entry.policy.getGrpcMetadata(authContext, request)).toEqual({
        'cadence-authorization': token,
      });
    });

    it('returns undefined when token is missing', async () => {
      mockAuthStrategy('jwt');

      const request = buildAuthRequest();
      const authContext = await resolveAuthContext(request);
      const entry = await getActiveAuthServerEntry();

      expect(
        await entry.policy.getGrpcMetadata(authContext, request)
      ).toBeUndefined();
    });

    it('returns undefined when auth is disabled even if token is present', async () => {
      const token = buildToken({ sub: 'user-id' });
      mockAuthStrategy('disabled');

      const request = buildAuthRequest(token);
      const authContext = await resolveAuthContext(request);
      const entry = await getActiveAuthServerEntry();

      expect(
        await entry.policy.getGrpcMetadata(authContext, request)
      ).toBeUndefined();
    });
  });
});
