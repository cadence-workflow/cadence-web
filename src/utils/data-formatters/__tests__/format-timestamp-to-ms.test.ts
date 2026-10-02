import formatTimestampToMs from '../format-timestamp-to-ms';

describe(formatTimestampToMs.name, () => {
  it('returns the timestamp in milliseconds for valid input', () => {
    expect(formatTimestampToMs({ seconds: 1622547802, nanos: 0 })).toBe(
      1622547802000
    );
  });

  it('returns null for null, undefined, or unparsable input', () => {
    expect(formatTimestampToMs(null)).toBeNull();
    expect(formatTimestampToMs(undefined)).toBeNull();
    expect(formatTimestampToMs({ seconds: 'invalid', nanos: 0 })).toBeNull();
  });
});
