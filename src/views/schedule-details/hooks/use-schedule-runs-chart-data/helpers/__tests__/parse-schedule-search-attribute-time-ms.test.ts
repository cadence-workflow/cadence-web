import parseScheduleSearchAttributeTimeMs from '../parse-schedule-search-attribute-time-ms';

describe(parseScheduleSearchAttributeTimeMs.name, () => {
  it('returns a finite number as-is', () => {
    expect(parseScheduleSearchAttributeTimeMs(1000)).toBe(1000);
  });

  it('returns the epoch ms of a Date', () => {
    expect(parseScheduleSearchAttributeTimeMs(new Date(1000))).toBe(1000);
  });

  it('parses a numeric string', () => {
    expect(parseScheduleSearchAttributeTimeMs('1000')).toBe(1000);
  });

  it('parses an ISO date string', () => {
    expect(parseScheduleSearchAttributeTimeMs('2024-01-01T00:00:00.000Z')).toBe(
      Date.parse('2024-01-01T00:00:00.000Z')
    );
  });

  it('returns null for unparsable input', () => {
    expect(parseScheduleSearchAttributeTimeMs('not-a-date')).toBeNull();
    expect(parseScheduleSearchAttributeTimeMs(null)).toBeNull();
    expect(parseScheduleSearchAttributeTimeMs(undefined)).toBeNull();
    expect(parseScheduleSearchAttributeTimeMs(NaN)).toBeNull();
  });
});
