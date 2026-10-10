import trustedHeaderAuthConfig from '../trusted-header-auth-config';

const ENV_KEYS = [
  'CADENCE_WEB_AUTH_STRATEGY',
  'CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA',
] as const;

describe(trustedHeaderAuthConfig.name, () => {
  const originalEnv = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]])
  );

  beforeEach(() => {
    ENV_KEYS.forEach((key) => delete process.env[key]);
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'trusted-header';
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
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'jwt';

    expect(trustedHeaderAuthConfig()).toBeNull();
  });

  it('resolves an empty metadata map', () => {
    expect(trustedHeaderAuthConfig()).toEqual([]);
  });

  it('parses the gRPC metadata map', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence-user, x-cadence-groups:cadence-groups';

    expect(trustedHeaderAuthConfig()).toEqual([
      { inboundHeader: 'x-cadence-user-id', outboundKey: 'cadence-user' },
      { inboundHeader: 'x-cadence-groups', outboundKey: 'cadence-groups' },
    ]);
  });

  it('throws on a malformed gRPC metadata map entry', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA = 'x-cadence-user-id';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /must be "inbound-header:outbound-key"/
    );
  });

  it('throws when a map entry has extra colon segments', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence-user:extra';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /must be "inbound-header:outbound-key"/
    );
  });

  it('throws on an invalid inbound header name', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x cadence user id:cadence-user';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /is not a valid HTTP header name/
    );
  });

  it('throws on an invalid outbound gRPC metadata key', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence user';

    expect(() => trustedHeaderAuthConfig()).toThrow(
      /has an invalid outbound key/
    );
  });

  it('throws on a -bin outbound gRPC metadata key', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence-user-bin';

    expect(() => trustedHeaderAuthConfig()).toThrow(/-bin/);
  });

  it('preserves the outbound key casing', () => {
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:Cadence-User';

    expect(trustedHeaderAuthConfig()).toEqual([
      { inboundHeader: 'x-cadence-user-id', outboundKey: 'Cadence-User' },
    ]);
  });
});
