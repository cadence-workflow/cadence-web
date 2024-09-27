import { type RetryPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';

import formatDurationToSeconds from '../format-duration-to-seconds';
import formatRetryPolicy from '../format-retry-policy';

jest.mock('../format-duration-to-seconds', () => jest.fn());
const mockedFormatDurationToSeconds =
  formatDurationToSeconds as jest.MockedFunction<
    typeof formatDurationToSeconds
  >;

describe('formatRetryPolicy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return null if retryPolicy is undefined', () => {
    expect(formatRetryPolicy(undefined)).toBeNull();
  });

  test('should return null if retryPolicy is null', () => {
    expect(formatRetryPolicy(null)).toBeNull();
  });

  test('should return formatted retry policy with valid input', () => {
    const retryPolicy: RetryPolicy = {
      expirationInterval: { seconds: '60', nanos: 0 },
      initialInterval: { seconds: '30', nanos: 0 },
      maximumInterval: { seconds: '300', nanos: 0 },
      backoffCoefficient: 10,
      maximumAttempts: 10,
      nonRetryableErrorReasons: [],
    };
    const formattedExpirationInterval = 60;
    const formattedInitialInterval = 30;
    const formattedMaximumInterval = 300;

    mockedFormatDurationToSeconds
      .mockReturnValueOnce(formattedExpirationInterval)
      .mockReturnValueOnce(formattedInitialInterval)
      .mockReturnValueOnce(formattedMaximumInterval);

    const expectedFormattedRetryPolicy = {
      expirationIntervalInSeconds: formattedExpirationInterval,
      initialIntervalInSeconds: formattedInitialInterval,
      maximumIntervalInSeconds: formattedMaximumInterval,
      backoffCoefficient: 10,
      maximumAttempts: 10,
      nonRetryableErrorReasons: [],
    };

    expect(formatRetryPolicy(retryPolicy)).toEqual(
      expectedFormattedRetryPolicy
    );
    expect(formatDurationToSeconds).toHaveBeenCalledWith(
      retryPolicy.expirationInterval
    );
    expect(formatDurationToSeconds).toHaveBeenCalledWith(
      retryPolicy.initialInterval
    );
    expect(formatDurationToSeconds).toHaveBeenCalledWith(
      retryPolicy.maximumInterval
    );
  });
});
