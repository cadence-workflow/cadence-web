import fs from 'fs';
import path from 'path';

import { type TrustedHeaderAuthConfig } from '@/config/dynamic/resolvers/trusted-header-auth-config.types';
import { AUTH_UNAVAILABLE_PATH } from '@/utils/auth/auth.constants';
import { type AuthContext, type AuthRequest } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import trustedHeaderServerPolicy from '../trusted-header-server-policy';

jest.mock('@/utils/config/get-config-value', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGetConfigValue = getConfigValue as jest.Mock;

const SECRET = 'test-only-shared-secret'; // 23 bytes
const WRONG_SECRET_SAME_LENGTH = 'test-only-shared-secreX'; // 23 bytes
const WRONG_SECRET_DIFF_LENGTH = 'wrong';

const CONFIG: TrustedHeaderAuthConfig = {
  userIdHeader: 'x-cadence-user-id',
  nameHeader: 'x-cadence-name',
  emailHeader: 'x-cadence-email',
  groupsHeader: 'x-cadence-groups',
  adminHeader: 'x-cadence-admin',
  grpcMetadataMap: [
    { inboundHeader: 'x-cadence-user-id', outboundKey: 'cadence-user' },
    { inboundHeader: 'x-cadence-admin', outboundKey: 'cadence-admin' },
  ],
  sharedSecretHeader: 'x-cadence-secret',
  sharedSecret: SECRET,
};

const INVALID_CONTEXT: AuthContext = {
  authEnabled: true,
  auth: { isValidToken: false, canRefresh: false },
  isAdmin: false,
  groups: [],
};

const VALID_CONTEXT: AuthContext = {
  authEnabled: true,
  auth: { isValidToken: true, canRefresh: false },
  isAdmin: false,
  groups: [],
};

function buildRequest(headers: Record<string, string>): AuthRequest {
  return {
    cookies: { get: () => undefined },
    headers: new Headers(headers),
  };
}

describe('trustedHeaderServerPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetConfigValue.mockImplementation(async (key: string) => {
      if (key === 'TRUSTED_HEADER_AUTH_CONFIG') return CONFIG;
      throw new Error(`Unexpected config key ${key}`);
    });
  });

  /**
   * Golden input matrix: with the secret configured, secret header
   * {absent, wrong same length, wrong different length, correct} × identity
   * header {present, absent} — asserting isValidToken AND the exact outbound
   * gRPC metadata per cell.
   */
  describe('golden input matrix (secret × identity)', () => {
    const VALID_CELL_METADATA: GRPCMetadata = {
      'cadence-user': 'alice',
      'cadence-admin': 'true',
    };

    const MATRIX: Array<{
      secretCase: string;
      secretValue?: string;
      identityPresent: boolean;
      expectValid: boolean;
    }> = [
      { secretCase: 'absent', identityPresent: true, expectValid: false },
      { secretCase: 'absent', identityPresent: false, expectValid: false },
      {
        secretCase: 'wrong (same length)',
        secretValue: WRONG_SECRET_SAME_LENGTH,
        identityPresent: true,
        expectValid: false,
      },
      {
        secretCase: 'wrong (same length)',
        secretValue: WRONG_SECRET_SAME_LENGTH,
        identityPresent: false,
        expectValid: false,
      },
      {
        secretCase: 'wrong (different length)',
        secretValue: WRONG_SECRET_DIFF_LENGTH,
        identityPresent: true,
        expectValid: false,
      },
      {
        secretCase: 'wrong (different length)',
        secretValue: WRONG_SECRET_DIFF_LENGTH,
        identityPresent: false,
        expectValid: false,
      },
      {
        secretCase: 'correct',
        secretValue: SECRET,
        identityPresent: true,
        expectValid: true,
      },
      {
        secretCase: 'correct',
        secretValue: SECRET,
        identityPresent: false,
        expectValid: false,
      },
    ];

    it.each(MATRIX)(
      'secret $secretCase, identity present: $identityPresent → valid: $expectValid',
      async ({ secretValue, identityPresent, expectValid }) => {
        const headers: Record<string, string> = {};
        if (identityPresent) {
          headers['x-cadence-user-id'] = 'alice';
          headers['x-cadence-admin'] = 'true';
        }
        if (secretValue !== undefined) {
          headers['x-cadence-secret'] = secretValue;
        }
        const request = buildRequest(headers);

        const context =
          await trustedHeaderServerPolicy.resolveAuthContext(request);
        expect(context.auth.isValidToken).toBe(expectValid);
        // Fail-closed identity: an invalid context never carries the forged
        // admin/identity claims.
        if (!expectValid) {
          expect(context.isAdmin).toBe(false);
          expect(context.id).toBeUndefined();
        }

        // The exact outbound gRPC metadata for the cell (the forwarding
        // gate: nothing leaves unless the context is valid).
        const metadata = await trustedHeaderServerPolicy.getGrpcMetadata(
          context,
          request
        );
        expect(metadata).toEqual(expectValid ? VALID_CELL_METADATA : undefined);
      }
    );
  });

  describe('resolveAuthContext', () => {
    it('maps identity, display name, groups, and admin from the configured headers', async () => {
      const request = buildRequest({
        'x-cadence-user-id': 'alice',
        'x-cadence-name': 'Alice A',
        'x-cadence-email': 'alice@example.test',
        'x-cadence-groups': 'cadence-readers, cadence-writers  cadence-ops',
        'x-cadence-admin': 'yes',
        'x-cadence-secret': SECRET,
      });

      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(request)
      ).resolves.toEqual({
        authEnabled: true,
        auth: { isValidToken: true, canRefresh: false },
        isAdmin: true,
        id: 'alice',
        userName: 'Alice A',
        groups: ['cadence-readers', 'cadence-writers', 'cadence-ops'],
      });
    });

    it('falls back name → email → id for the display identity', async () => {
      const withEmailOnly = buildRequest({
        'x-cadence-user-id': 'alice',
        'x-cadence-email': 'alice@example.test',
        'x-cadence-secret': SECRET,
      });
      const withIdOnly = buildRequest({
        'x-cadence-user-id': 'alice',
        'x-cadence-secret': SECRET,
      });

      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(withEmailOnly)
      ).resolves.toMatchObject({ userName: 'alice@example.test' });
      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(withIdOnly)
      ).resolves.toMatchObject({ userName: 'alice' });
    });

    it('treats a Node-joined duplicate admin header (true, false) as not admin', async () => {
      const headers = new Headers({
        'x-cadence-user-id': 'alice',
        'x-cadence-secret': SECRET,
      });
      headers.append('x-cadence-admin', 'true');
      headers.append('x-cadence-admin', 'false');
      expect(headers.get('x-cadence-admin')).toBe('true, false');

      const context = await trustedHeaderServerPolicy.resolveAuthContext({
        cookies: { get: () => undefined },
        headers,
      });

      expect(context.auth.isValidToken).toBe(true);
      expect(context.isAdmin).toBe(false);
    });

    it.each(['false', '0', 'no', 'truee', '2'])(
      'never treats "%s" as admin (exact allowlist, never JS truthiness)',
      async (adminValue) => {
        const request = buildRequest({
          'x-cadence-user-id': 'alice',
          'x-cadence-admin': adminValue,
          'x-cadence-secret': SECRET,
        });

        const context =
          await trustedHeaderServerPolicy.resolveAuthContext(request);

        expect(context.auth.isValidToken).toBe(true);
        expect(context.isAdmin).toBe(false);
      }
    );

    it('rejects a forged admin header when the secret is missing', async () => {
      const request = buildRequest({
        'x-cadence-user-id': 'attacker',
        'x-cadence-admin': 'true',
      });

      const context =
        await trustedHeaderServerPolicy.resolveAuthContext(request);

      expect(context.auth.isValidToken).toBe(false);
      expect(context.isAdmin).toBe(false);
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(context, request)
      ).resolves.toBeUndefined();
    });

    it('accepts bare headers when no secret pair is configured (boot-WARNed trust model)', async () => {
      const { sharedSecretHeader, sharedSecret, ...bareConfig } = CONFIG;
      void sharedSecretHeader;
      void sharedSecret;
      mockGetConfigValue.mockImplementation(async (key: string) => {
        if (key === 'TRUSTED_HEADER_AUTH_CONFIG') return bareConfig;
        throw new Error(`Unexpected config key ${key}`);
      });
      const request = buildRequest({ 'x-cadence-user-id': 'alice' });

      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(request)
      ).resolves.toMatchObject({
        auth: { isValidToken: true, canRefresh: false },
        id: 'alice',
      });
    });

    it('returns the unauthenticated context when the config is absent', async () => {
      mockGetConfigValue.mockResolvedValue(null);

      await expect(
        trustedHeaderServerPolicy.resolveAuthContext(
          buildRequest({ 'x-cadence-user-id': 'alice' })
        )
      ).resolves.toEqual(INVALID_CONTEXT);
    });
  });

  describe('getGrpcMetadata (the forwarding gate)', () => {
    it('forged headers + no valid context → outbound gRPC metadata empty (golden)', async () => {
      const forged = buildRequest({
        'x-cadence-user-id': 'attacker',
        'x-cadence-admin': 'true',
      });

      // The gate keys on the context, not the request: even a hand-built
      // invalid context over a header-carrying request forwards nothing.
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(INVALID_CONTEXT, forged)
      ).resolves.toBeUndefined();
    });

    it('returns undefined when auth is disabled in the context', async () => {
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(
          { ...VALID_CONTEXT, authEnabled: false },
          buildRequest({ 'x-cadence-user-id': 'alice' })
        )
      ).resolves.toBeUndefined();
    });

    it('returns undefined when no configured inbound header is present', async () => {
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(
          VALID_CONTEXT,
          buildRequest({ 'x-unrelated': 'value' })
        )
      ).resolves.toBeUndefined();
    });

    it('forwards only the configured map, verbatim values', async () => {
      await expect(
        trustedHeaderServerPolicy.getGrpcMetadata(
          VALID_CONTEXT,
          buildRequest({
            'x-cadence-user-id': 'alice',
            'x-cadence-groups': 'ignored-by-the-map',
          })
        )
      ).resolves.toEqual({ 'cadence-user': 'alice' });
    });
  });

  describe('getLoginRedirectIfNeeded', () => {
    it('returns null for a valid context', () => {
      expect(
        trustedHeaderServerPolicy.getLoginRedirectIfNeeded(
          VALID_CONTEXT,
          '/domains'
        )
      ).toBeNull();
    });

    it('returns the status-page path for an invalid context', () => {
      expect(
        trustedHeaderServerPolicy.getLoginRedirectIfNeeded(
          INVALID_CONTEXT,
          '/domains',
          'session-expired'
        )
      ).toBe(AUTH_UNAVAILABLE_PATH);
    });

    // Placement pin: the status page lives OUTSIDE the (Home) gated route
    // group — otherwise the gate redirects to it while the context is still
    // invalid and the page loops on itself.
    it('the status page exists outside the (Home) gated group (no gate loop)', () => {
      const srcRoot = path.resolve(__dirname, '../../../../../');

      expect(AUTH_UNAVAILABLE_PATH).toBe('/auth-unavailable');
      expect(
        fs.existsSync(path.join(srcRoot, 'app/auth-unavailable/page.tsx'))
      ).toBe(true);
      expect(
        fs.existsSync(path.join(srcRoot, 'app/(Home)/auth-unavailable'))
      ).toBe(false);
    });
  });

  describe('getSessionKey', () => {
    it('returns the designated identity header value verbatim, stably', async () => {
      const request = buildRequest({
        'x-cadence-user-id': 'alice',
        'x-cadence-groups': 'group-a',
        'x-cadence-admin': 'true',
      });

      const first = await trustedHeaderServerPolicy.getSessionKey(request);
      const second = await trustedHeaderServerPolicy.getSessionKey(request);

      expect(first).toBe('alice');
      expect(second).toBe(first);
    });

    it('never derives from groups/admin headers (they never enter the pre-image)', async () => {
      const base = { 'x-cadence-user-id': 'alice' };
      const withGroups = buildRequest({
        ...base,
        'x-cadence-groups': 'group-b',
        'x-cadence-admin': 'false',
      });

      await expect(
        trustedHeaderServerPolicy.getSessionKey(withGroups)
      ).resolves.toBe('alice');
    });

    it('returns undefined when the identity header is absent', async () => {
      await expect(
        trustedHeaderServerPolicy.getSessionKey(buildRequest({}))
      ).resolves.toBeUndefined();
    });
  });

  it('fails closed and loud on recoverSession (unreachable by design)', async () => {
    await expect(
      trustedHeaderServerPolicy.recoverSession(buildRequest({}), {})
    ).rejects.toThrow('trusted-header strategy has no session to recover');
  });
});
