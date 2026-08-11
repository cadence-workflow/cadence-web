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
    const expectedEndTimeMs = new Date('2024-01-01T10:01:00Z').getTime(); // 1 minute ago

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toBeNull();
  });

  it('should return null when expected duration exactly matches current time', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:02:00Z').getTime(); // exactly now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toBeNull();
  });

  it('should return remaining time when duration has not passed', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:05:00Z').getTime(); // 3 minutes from now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toEqual('mocked: 180s'); // 3 minutes = 180 seconds
  });

  it('should return 1s when less than 1 second remaining', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:02:00.500Z').getTime(); // 0.5 seconds from now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toEqual('mocked: 1s');
  });

  it('should work with numeric timestamp for expected end time', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:05:00Z').getTime(); // 3 minutes from now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toEqual('mocked: 180s');
  });

  it('should round up partial seconds using Math.ceil', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:02:01.300Z').getTime(); // 1.3 seconds from now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toEqual('mocked: 2s'); // Math.ceil(1.3) = 2
  });

  it('should handle exactly 1 second remaining', () => {
    const expectedEndTimeMs = new Date('2024-01-01T10:02:01Z').getTime(); // exactly 1 second from now

    const result = getFormattedRemainingDuration(expectedEndTimeMs);

    expect(result).toEqual('mocked: 1s');
  });
});
