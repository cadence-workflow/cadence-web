import mapRetryPolicyToGrpcInput from '../map-retry-policy-to-grpc-input';

describe(mapRetryPolicyToGrpcInput.name, () => {
  it('returns undefined when retryPolicy is undefined', () => {
    expect(mapRetryPolicyToGrpcInput(undefined)).toBeUndefined();
  });

  it('returns undefined when retryPolicy is an empty object', () => {
    expect(mapRetryPolicyToGrpcInput({})).toBeUndefined();
  });

  it('maps interval fields to Duration inputs and passes through scalar fields', () => {
    expect(
      mapRetryPolicyToGrpcInput({
        initialIntervalSeconds: 2,
        backoffCoefficient: 1.5,
        maximumIntervalSeconds: 60,
        expirationIntervalSeconds: 300,
        maximumAttempts: 5,
      })
    ).toEqual({
      initialInterval: { seconds: 2, nanos: 0 },
      backoffCoefficient: 1.5,
      maximumInterval: { seconds: 60, nanos: 0 },
      expirationInterval: { seconds: 300, nanos: 0 },
      maximumAttempts: 5,
    });
  });

  it('omits Duration fields when corresponding seconds are not set', () => {
    expect(
      mapRetryPolicyToGrpcInput({
        backoffCoefficient: 2,
        maximumAttempts: 1,
      })
    ).toEqual({
      initialInterval: undefined,
      backoffCoefficient: 2,
      maximumInterval: undefined,
      expirationInterval: undefined,
      maximumAttempts: 1,
    });
  });
});
