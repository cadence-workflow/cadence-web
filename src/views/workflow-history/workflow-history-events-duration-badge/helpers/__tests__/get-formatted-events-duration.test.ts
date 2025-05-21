import getFormattedEventsDuration from '../get-formatted-events-duration';

jest.mock('@/utils/data-formatters/format-duration', () => ({
  __esModule: true,
  default: jest.fn((duration) => `mocked: ${duration.seconds}s`),
}));

describe('getFormattedEventsDuration', () => {
  it('should return 0s for identical start and end times', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T00:00:00Z',
      '2021-01-01T00:00:00Z'
    );
    expect(duration).toEqual('mocked: 0s');
  });

  it('should return correct duration for 1 minute', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T00:00:00Z',
      '2021-01-01T00:01:00Z'
    );
    expect(duration).toEqual('mocked: 60s');
  });

  it('should return correct duration for 1 hour, 2 minutes, 3 seconds', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T01:02:03Z',
      '2021-01-01T02:04:06Z'
    );
    expect(duration).toEqual(`mocked: ${60 * 60 + 2 * 60 + 3}s`);
  });

  it('should handle endTime as null (use current time)', () => {
    const start = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    const duration = getFormattedEventsDuration(start, null);
    expect(duration).toEqual('mocked: 60s');
  });

  it('should handle negative durations (start after end)', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T01:00:00Z',
      '2021-01-01T00:00:00Z'
    );
    expect(duration).toEqual('mocked: -3600s');
  });
});
