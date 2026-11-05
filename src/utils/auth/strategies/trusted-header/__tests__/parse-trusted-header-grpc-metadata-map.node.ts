import parseTrustedHeaderGrpcMetadataMap from '../parse-trusted-header-grpc-metadata-map';

describe(parseTrustedHeaderGrpcMetadataMap.name, () => {
  it('resolves an empty metadata map', () => {
    expect(parseTrustedHeaderGrpcMetadataMap(undefined)).toEqual([]);
    expect(parseTrustedHeaderGrpcMetadataMap('')).toEqual([]);
    expect(parseTrustedHeaderGrpcMetadataMap('   ')).toEqual([]);
  });

  it('parses the gRPC metadata map', () => {
    expect(
      parseTrustedHeaderGrpcMetadataMap(
        'x-cadence-user-id:cadence-user, x-cadence-groups:cadence-groups'
      )
    ).toEqual([
      { inboundHeader: 'x-cadence-user-id', outboundKey: 'cadence-user' },
      { inboundHeader: 'x-cadence-groups', outboundKey: 'cadence-groups' },
    ]);
  });

  it('throws on a malformed gRPC metadata map entry', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id')
    ).toThrow(/must be "inbound-header:outbound-key"/);
  });

  it('throws when a map entry has extra colon segments', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id:cadence-user:extra')
    ).toThrow(/must be "inbound-header:outbound-key"/);
  });

  it('throws on an invalid inbound header name', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x cadence user id:cadence-user')
    ).toThrow(
      /entry "x cadence user id:cadence-user" has an invalid inbound header/
    );
  });

  it('throws on an invalid outbound gRPC metadata key', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id:cadence user')
    ).toThrow(/has an invalid outbound key/);
  });

  it('throws on a -bin outbound gRPC metadata key', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id:cadence-user-bin')
    ).toThrow(/-bin/);
  });

  it('throws on a __proto__ outbound gRPC metadata key', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id:__proto__')
    ).toThrow(/__proto__/);
  });

  it('preserves the outbound key casing', () => {
    expect(
      parseTrustedHeaderGrpcMetadataMap('x-cadence-user-id:Cadence-User')
    ).toEqual([
      { inboundHeader: 'x-cadence-user-id', outboundKey: 'Cadence-User' },
    ]);
  });

  it('uses a custom source label in errors', () => {
    expect(() =>
      parseTrustedHeaderGrpcMetadataMap('bad', 'MY_FORK_ENV')
    ).toThrow(/^MY_FORK_ENV entry/);
  });
});
