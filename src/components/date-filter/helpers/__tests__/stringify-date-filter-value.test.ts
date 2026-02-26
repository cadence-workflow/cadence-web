import stringifyDateFilterValue from '../stringify-date-filter-value';

// Mock the current date to be fixed
jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

describe('stringifyDateFilterValue', () => {
  it('returns the value as is for string values', () => {
    expect(stringifyDateFilterValue('now')).toBe('now');
    expect(stringifyDateFilterValue('now-5m')).toBe('now-5m');
  });

  it('returns ISO string for Date objects when prettyPrint is not specified', () => {
    const date = new Date('2023-05-23T10:30:00.000Z');
    expect(stringifyDateFilterValue(date)).toBe('2023-05-23T10:30:00.000Z');
  });

  it('formats dates from current year with just month and day when prettyPrint=pretty', () => {
    const date = new Date('2023-05-23T10:30:00.000Z');
    expect(stringifyDateFilterValue(date, 'pretty')).toBe(
      '23 May, 10:30:00 UTC'
    );
  });

  it('includes year for dates not in current year when prettyPrint=pretty', () => {
    const date = new Date('2022-05-23T10:30:00.000Z');
    expect(stringifyDateFilterValue(date, 'pretty')).toBe(
      '23 May 2022, 10:30:00 UTC'
    );
  });
});
