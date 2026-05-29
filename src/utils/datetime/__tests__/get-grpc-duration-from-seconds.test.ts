import getGrpcDurationFromSeconds from '../get-grpc-duration-from-seconds';

describe(getGrpcDurationFromSeconds.name, () => {
  it('maps whole seconds to a protobuf Duration with zero nanos', () => {
    expect(getGrpcDurationFromSeconds(0)).toEqual({ seconds: 0, nanos: 0 });
    expect(getGrpcDurationFromSeconds(3600)).toEqual({
      seconds: 3600,
      nanos: 0,
    });
    expect(getGrpcDurationFromSeconds(10)).toEqual({ seconds: 10, nanos: 0 });
  });

  it('puts fractional seconds in nanos', () => {
    expect(getGrpcDurationFromSeconds(1.5)).toEqual({
      seconds: 1,
      nanos: 500_000_000,
    });
    expect(getGrpcDurationFromSeconds(10.25)).toEqual({
      seconds: 10,
      nanos: 250_000_000,
    });
    expect(getGrpcDurationFromSeconds(0.001)).toEqual({
      seconds: 0,
      nanos: 1_000_000,
    });
  });

  it('carries a full second when rounding nanos reaches 1e9', () => {
    expect(getGrpcDurationFromSeconds(1.9999999995)).toEqual({
      seconds: 2,
      nanos: 0,
    });
  });
});
