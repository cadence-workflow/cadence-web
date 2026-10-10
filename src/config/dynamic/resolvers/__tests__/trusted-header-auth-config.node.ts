import authStrategy from '../auth-strategy';
import trustedHeaderAuthConfig from '../trusted-header-auth-config';

jest.mock('../auth-strategy', () => jest.fn(() => 'trusted-header'));

const mockAuthStrategy = authStrategy as jest.Mock;

const ENV_KEYS = [
  'CADENCE_WEB_AUTH_STRATEGY',
  'CADENCE_WEB_TRUSTED_HEADER_USER_ID',
  'CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA',
] as const;

describe(trustedHeaderAuthConfig.name, () => {
  const originalEnv = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]])
  );

  beforeEach(() => {
    jest.clearAllMocks();
    ENV_KEYS.forEach((key) => delete process.env[key]);
    mockAuthStrategy.mockReturnValue('trusted-header');
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
    mockAuthStrategy.mockReturnValue('jwt');

    expect(trustedHeaderAuthConfig()).toBeNull();
  });

  it('throws when the designated identity header is missing', () => {
    expect(() => trustedHeaderAuthConfig()).toThrow(
      /CADENCE_WEB_TRUSTED_HEADER_USER_ID/
    );
  });

  it('resolves the user-id header and an empty metadata map', () => {
    setMinimalEnv();

    expect(trustedHeaderAuthConfig()).toEqual({
      userIdHeader: 'x-cadence-user-id',
      grpcMetadataMap: [],
    });
  });

  it('parses the gRPC metadata map', () => {
    setMinimalEnv();
    process.env.CADENCE_WEB_TRUSTED_HEADER_GRPC_METADATA =
      'x-cadence-user-id:cadence-user, x-cadence-groups:cadence-groups';

    expect(trustedHeaderAuthConfig()).toEqual({
      userIdHeader: 'x-cadence-user-id',
      grpcMetadataMap: [
        { inboundHeader: 'x-cadence-user-id', outboundKey: 'cadence-user' },
        { inboundHeader: 'x-cadence-groups', outboundKey: 'cadence-groups' },
      ],
    });
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
