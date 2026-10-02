import logger from '@/utils/logger';

import trustedHeaderAuthConfig from '../trusted-header-auth-config';

jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

const mockWarn = logger.warn as jest.Mock;

const ENV_KEYS = [
  'CADENCE_WEB_AUTH_STRATEGY',
  'CADENCE_WEB_TRUSTED_HEADER_USER_ID',
  'CADENCE_WEB_TRUSTED_HEADER_EMAIL',
  'CADENCE_WEB_TRUSTED_HEADER_NAME',
  'CADENCE_WEB_TRUSTED_HEADER_GROUPS',
  'CADENCE_WEB_TRUSTED_HEADER_ADMIN',
  'CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA',
  'CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER',
  'CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET',
] as const;

describe(trustedHeaderAuthConfig.name, () => {
  const originalEnv = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]])
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  });

  it('returns null when the strategy is not trusted-header', () => {
    setMinimalEnv();
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'jwt';

    expect(trustedHeaderAuthConfig()).toBeNull();
  });

  it('throws when the designated identity header is missing', () => {
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'trusted-header';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /CADENCE_WEB_TRUSTED_HEADER_USER_ID/
    );
  });

  it('resolves the minimal config with optional fields unset', () => {
    setMinimalEnv();

    expect(trustedHeaderAuthConfig()).toEqual({
      userIdHeader: 'x-cadence-user-id',
      emailHeader: undefined,
      nameHeader: undefined,
      groupsHeader: undefined,
      adminHeader: undefined,
      grpcMetadataMap: [],
      sharedSecretHeader: undefined,
      sharedSecret: undefined,
    });
  });

  it('resolves the full config, parsing the gRPC metadata map', () => {
    setMinimalEnv();
    process.env.CADENCE_WEB_TRUSTED_HEADER_EMAIL = 'x-cadence-email';
    process.env.CADENCE_WEB_TRUSTED_HEADER_NAME = ' x-cadence-name ';
    process.env.CADENCE_WEB_TRUSTED_HEADER_GROUPS = 'x-cadence-groups';
    process.env.CADENCE_WEB_TRUSTED_HEADER_ADMIN = 'x-cadence-admin';
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence-user, x-cadence-groups:cadence-groups';
    process.env.CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER =
      'x-cadence-secret';
    process.env.CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET =
      'test-only-shared-secret';

    expect(trustedHeaderAuthConfig()).toEqual({
      userIdHeader: 'x-cadence-user-id',
      emailHeader: 'x-cadence-email',
      nameHeader: 'x-cadence-name',
      groupsHeader: 'x-cadence-groups',
      adminHeader: 'x-cadence-admin',
      grpcMetadataMap: [
        { inboundHeader: 'x-cadence-user-id', outboundKey: 'cadence-user' },
        { inboundHeader: 'x-cadence-groups', outboundKey: 'cadence-groups' },
      ],
      sharedSecretHeader: 'x-cadence-secret',
      sharedSecret: 'test-only-shared-secret',
    });
    expect(mockWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET_HEADER'],
    ['CADENCE_WEB_TRUSTED_HEADER_SHARED_SECRET'],
  ])('throws when only half the secret pair is set (%s)', (lonelyKey) => {
    setMinimalEnv();
    process.env[lonelyKey] = 'x-cadence-secret';

    expect(() => trustedHeaderAuthConfig()).toThrow(/must be set together/);
  });

  it('WARNs at boot when the secret pair is absent (bare headers)', () => {
    setMinimalEnv();

    expect(trustedHeaderAuthConfig()).not.toBeNull();
    expect(mockWarn).toHaveBeenCalledWith(
      expect.stringContaining('perimeter stripping is the only defense')
    );
  });

  it('throws on a malformed gRPC metadata map entry', () => {
    setMinimalEnv();
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA = 'x-cadence-user-id';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /must be "inbound-header:outbound-key"/
    );
  });
});

function setMinimalEnv() {
  process.env.CADENCE_WEB_AUTH_STRATEGY = 'trusted-header';
  process.env.CADENCE_WEB_TRUSTED_HEADER_USER_ID = 'x-cadence-user-id';
}
