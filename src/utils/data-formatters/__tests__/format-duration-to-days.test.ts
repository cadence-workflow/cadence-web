import formatDurationToDays from '../format-duration-to-days';

describe(formatDurationToDays.name, () => {
  test('should return correct value for valid duration', () => {
    expect(formatDurationToDays({ seconds: 172800, nanos: 0 })).toBe(2);
  });

  test('should return null for null input', () => {
    expect(formatDurationToDays(null)).toBeNull();
  });

  test('should round down duration to nearest whole day', () => {
    expect(formatDurationToDays({ seconds: 90000, nanos: 321 })).toBe(1);
  });
});
