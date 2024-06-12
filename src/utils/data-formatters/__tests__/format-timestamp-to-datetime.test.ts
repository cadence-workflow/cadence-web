import formatTimestampToDatetime from '../format-timestamp-to-datetime';

describe('formatTimestampToDatetime', () => {
  test('should return null for null input', () => {
    expect(formatTimestampToDatetime(null)).toBeNull();
  });

  test('should return null for undefined input', () => {
    expect(formatTimestampToDatetime(undefined)).toBeNull();
  });

  test('should format timestamp correctly for valid input', () => {
    const timestamp = { seconds: 1622547802, nanos: 123456789 };
    const expectedDate = new Date(1622547802123.4568);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should format timestamp correctly for string input', () => {
    const timestamp = { seconds: '1622547802', nanos: '123456789' };
    const expectedDate = new Date(1622547802123.4568);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should handle zero nanos', () => {
    const timestamp = { seconds: 1622547802, nanos: 0 };
    const expectedDate = new Date(1622547802000);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should handle zero seconds', () => {
    const timestamp = { seconds: 0, nanos: 123456789 };
    const expectedDate = new Date(123.456789);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should handle both seconds and nanos as zero', () => {
    const timestamp = { seconds: 0, nanos: 0 };
    const expectedDate = new Date(0);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should handle large numbers for seconds and nanos', () => {
    const timestamp = { seconds: '2147483647', nanos: '999999999' };
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedDate = new Date(2147483647999.999999);
    expect(formatTimestampToDatetime(timestamp)).toEqual(expectedDate);
  });

  test('should return NaN for invalid seconds input', () => {
    const timestamp = { seconds: 'invalid', nanos: 123456789 };
    // @ts-expect-error - intentionally testing invalid input
    expect(formatTimestampToDatetime(timestamp).toString()).toEqual(
      'Invalid Date'
    );
  });

  test('should return NaN for invalid nanos input', () => {
    const timestamp = { seconds: 1622547802, nanos: 'invalid' };
    // @ts-expect-error - intentionally testing invalid input
    expect(formatTimestampToDatetime(timestamp).toString()).toEqual(
      'Invalid Date'
    );
  });

  test('should return NaN for both invalid seconds and nanos input', () => {
    const timestamp = { seconds: 'invalid', nanos: 'invalid' };
    // @ts-expect-error - intentionally testing invalid input
    expect(formatTimestampToDatetime(timestamp).toString()).toEqual(
      'Invalid Date'
    );
  });
});
