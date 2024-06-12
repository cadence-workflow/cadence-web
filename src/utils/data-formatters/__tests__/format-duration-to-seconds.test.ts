import formatDurationToSeconds from '../format-duration-to-seconds';

describe('formatDurationToSeconds', () => {
  test('should return null for undefined input', () => {
    expect(formatDurationToSeconds()).toBeNull();
  });

  test('should return null for null input', () => {
    expect(formatDurationToSeconds(null)).toBeNull();
  });

  test('should return seconds as number for valid input', () => {
    const duration = { seconds: 60 };
    expect(formatDurationToSeconds(duration)).toBe(60);
  });

  test('should handle string input for seconds', () => {
    const duration = { seconds: '120' };
    expect(formatDurationToSeconds(duration)).toBe(120);
  });

  test('should handle zero seconds', () => {
    const duration = { seconds: 0 };
    expect(formatDurationToSeconds(duration)).toBe(0);
  });

  test('should handle large numbers for seconds', () => {
    const duration = { seconds: '2147483647' };
    expect(formatDurationToSeconds(duration)).toBe(2147483647);
  });

  test('should return NaN for invalid seconds input', () => {
    const duration = { seconds: 'invalid' };
    expect(formatDurationToSeconds(duration)).toBeNaN();
  });

  test('should return NaN for missing seconds input', () => {
    const duration = {};
    // @ts-expect-error - intentionally testing invalid input
    expect(formatDurationToSeconds(duration)).toBeNaN();
  });
});
