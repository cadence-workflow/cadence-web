import secondsToGrpcDurationInput from '../seconds-to-grpc-duration-input';

describe(secondsToGrpcDurationInput.name, () => {
  it('maps seconds to a protobuf Duration input with zero nanos', () => {
    expect(secondsToGrpcDurationInput(0)).toEqual({ seconds: 0, nanos: 0 });
    expect(secondsToGrpcDurationInput(3600)).toEqual({ seconds: 3600, nanos: 0 });
    expect(secondsToGrpcDurationInput(10)).toEqual({ seconds: 10, nanos: 0 });
  });
});
