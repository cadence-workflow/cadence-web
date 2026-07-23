import mapRetryPolicyFormToBody from '../map-retry-policy-form-to-body';

describe(mapRetryPolicyFormToBody.name, () => {
  it('returns undefined when retry policy is disabled', () => {
    expect(
      mapRetryPolicyFormToBody({
        enableRetryPolicy: false,
        limitRetries: 'ATTEMPTS',
        retryPolicy: {
          initialIntervalSeconds: '10',
          backoffCoefficient: '2',
        },
      })
    ).toBeUndefined();
  });

  it('maps attempts limit fields', () => {
    expect(
      mapRetryPolicyFormToBody({
        enableRetryPolicy: true,
        limitRetries: 'ATTEMPTS',
        retryPolicy: {
          initialIntervalSeconds: '10',
          backoffCoefficient: '2',
          maximumIntervalSeconds: '100',
          maximumAttempts: '5',
        },
      })
    ).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2,
      maximumIntervalSeconds: 100,
      maximumAttempts: 5,
    });
  });

  it('maps duration limit fields', () => {
    expect(
      mapRetryPolicyFormToBody({
        enableRetryPolicy: true,
        limitRetries: 'DURATION',
        retryPolicy: {
          initialIntervalSeconds: '10',
          backoffCoefficient: '2',
          expirationIntervalSeconds: '3600',
        },
      })
    ).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2,
      expirationIntervalSeconds: 3600,
    });
  });

  it('maps empty form values to undefined', () => {
    expect(
      mapRetryPolicyFormToBody({
        enableRetryPolicy: true,
        limitRetries: 'ATTEMPTS',
        retryPolicy: {
          initialIntervalSeconds: '',
          backoffCoefficient: '',
          maximumIntervalSeconds: '',
          maximumAttempts: '',
        },
      })
    ).toEqual({
      initialIntervalSeconds: undefined,
      backoffCoefficient: undefined,
      maximumAttempts: undefined,
    });
  });
});
