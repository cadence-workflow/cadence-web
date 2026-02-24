import parseDateFilterValue from '../parse-date-filter-value';

// Mock is-relative-date-filter-value
jest.mock('../is-relative-date-filter-value', () => ({
  __esModule: true,
  default: (v: string) => v.startsWith('now-'),
}));

describe('parseDateFilterValue', () => {
  it('returns the value as is for relative date values', () => {
    expect(parseDateFilterValue('now-5m')).toBe('now-5m');
    expect(parseDateFilterValue('now-1h')).toBe('now-1h');
  });

  it('parses string dates into Date objects when format is valid', () => {
    const result = parseDateFilterValue('2023-05-23T10:30:00.000Z');
    expect(result instanceof Date).toBe(true);
    expect((result as Date).toISOString()).toBe('2023-05-23T10:30:00.000Z');
  });

  it('returns undefined when date format is invalid', () => {
    const result = parseDateFilterValue('invalid-date');
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty strings', () => {
    expect(parseDateFilterValue('')).toBeUndefined();
  });
});
