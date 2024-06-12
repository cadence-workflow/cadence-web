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
    const retryPolicy = {
      expirationInterval: { seconds: 60 },
      initialInterval: { seconds: '30' },
      maximumInterval: { seconds: 300 },
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
