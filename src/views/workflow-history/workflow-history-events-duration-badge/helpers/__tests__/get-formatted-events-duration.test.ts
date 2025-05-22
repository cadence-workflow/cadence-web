import getFormattedEventsDuration from '../get-formatted-events-duration';

jest.mock('@/utils/data-formatters/format-duration', () => ({
  __esModule: true,
  default: jest.fn(
    (duration) => `mocked: ${duration.seconds}s ${duration.nanos / 1000000}ms`
  ),
}));

const mockNow = new Date('2024-01-01T10:02:00Z');

describe('getFormattedEventsDuration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return 0s for identical start and end times', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T00:00:00Z',
      '2021-01-01T00:00:00Z'
    );
    expect(duration).toEqual('mocked: 0s 0ms');
  });

  it('should return correct duration for 1 minute', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T00:00:00Z',
      '2021-01-01T00:01:00Z'
    );
    expect(duration).toEqual('mocked: 60s 0ms');
  });

  it('should return correct duration for 1 hour, 2 minutes, 3 seconds', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T01:02:03Z',
      '2021-01-01T02:04:06Z'
    );
    expect(duration).toEqual(`mocked: ${60 * 60 + 2 * 60 + 3}s 0ms`);
  });

  it('should handle endTime as null (use current time)', () => {
    const start = new Date(mockNow.getTime() - 60000).toISOString(); // 1 minute ago
    const duration = getFormattedEventsDuration(start, null);
    expect(duration).toEqual('mocked: 60s 0ms');
  });

  it('should handle negative durations (start after end)', () => {
    const duration = getFormattedEventsDuration(
      '2021-01-01T01:00:00Z',
      '2021-01-01T00:00:00Z'
    );
    expect(duration).toEqual('mocked: -3600s 0ms');
  });

  it('should handle numeric durations', () => {
    const duration = getFormattedEventsDuration(1726652232190, 1726652292194);
    expect(duration).toEqual('mocked: 60s 4ms');
  });

  it('should remove ms from duration when hideMs is true', () => {
    const duration = getFormattedEventsDuration(
      1726652232190,
      1726652292194,
      true
    );
    expect(duration).toEqual('mocked: 60s');
  });

  it('should not hide ms if there are no bigger units', () => {
    const duration = getFormattedEventsDuration(
      1726652232190,
      1726652232194,
      true
    );
    expect(duration).toEqual('mocked: 0s 4ms');
  });
});
