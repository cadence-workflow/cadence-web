import getFormattedRemainingDuration from '../get-formatted-remaining-duration';

jest.mock('@/utils/data-formatters/format-duration', () => ({
  __esModule: true,
  default: jest.fn((duration) => `mocked: ${duration.seconds}s`),
}));

const mockNow = new Date('2024-01-01T10:02:00Z');

describe('getFormattedRemainingDuration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return null when expected duration has passed', () => {
    const startTime = new Date('2024-01-01T10:00:00Z'); // 2 minutes ago
    const expectedDurationMs = 60 * 1000; // 1 minute expected duration

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toBeNull();
  });

  it('should return null when expected duration exactly matches current time', () => {
    const startTime = new Date('2024-01-01T10:00:00Z'); // 2 minutes ago
    const expectedDurationMs = 2 * 60 * 1000; // 2 minutes expected duration

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toBeNull();
  });

  it('should return remaining time when duration has not passed', () => {
    const startTime = new Date('2024-01-01T10:00:00Z'); // 2 minutes ago
    const expectedDurationMs = 5 * 60 * 1000; // 5 minutes expected duration (3 minutes remaining)

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 180s'); // 3 minutes = 180 seconds
  });

  it('should return 1s when less than 1 second remaining', () => {
    const startTime = new Date('2024-01-01T10:01:59.500Z'); // 0.5 seconds ago
    const expectedDurationMs = 1000; // 1 second expected duration (0.5 seconds remaining)

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 1s');
  });

  it('should handle string start times', () => {
    const startTime = '2024-01-01T10:00:00Z'; // 2 minutes ago
    const expectedDurationMs = 5 * 60 * 1000; // 5 minutes expected duration

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 180s');
  });

  it('should handle numeric start times', () => {
    const startTime = new Date('2024-01-01T10:00:00Z').getTime(); // 2 minutes ago
    const expectedDurationMs = 5 * 60 * 1000; // 5 minutes expected duration

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 180s');
  });

  it('should round up partial seconds using Math.ceil', () => {
    const startTime = new Date('2024-01-01T10:01:58.700Z'); // 1.3 seconds ago
    const expectedDurationMs = 3000; // 3 seconds expected duration (1.3 seconds remaining)

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 2s'); // Math.ceil(1.3) = 2
  });

  it('should handle exactly 1 second remaining', () => {
    const startTime = new Date('2024-01-01T10:01:59Z'); // 1 second ago
    const expectedDurationMs = 2000; // 2 seconds expected duration (1 second remaining)

    const result = getFormattedRemainingDuration(startTime, expectedDurationMs);

    expect(result).toEqual('mocked: 1s');
  });
});
