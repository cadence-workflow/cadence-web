import getGrpcTimestampFromIso from '../get-grpc-timestamp-from-iso';

describe(getGrpcTimestampFromIso.name, () => {
  it('should get a GRPC Timestamp object given the ISO 8601 date', () => {
    expect(getGrpcTimestampFromIso('2024-04-02T22:15:00.000Z')).toEqual({
      seconds: 1712096100,
      nanos: 0,
    });
  });

  it('should put sub-second precision in nanos with integer seconds', () => {
    expect(getGrpcTimestampFromIso('2024-04-02T22:15:00.500Z')).toEqual({
      seconds: 1712096100,
      nanos: 500_000_000,
    });
  });
});
