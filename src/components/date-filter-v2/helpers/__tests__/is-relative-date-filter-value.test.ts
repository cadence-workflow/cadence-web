import { DATE_FILTER_RELATIVE_VALUES } from '../../date-filter-v2.constants';
import isRelativeDateFilterValue from '../is-relative-date-filter-value';

describe('isRelativeDateFilterValue', () => {
  it('returns true for valid relative date filter values', () => {
    // Test all keys from the constants
    Object.keys(DATE_FILTER_RELATIVE_VALUES).forEach((key) => {
      expect(isRelativeDateFilterValue(key)).toBe(true);
    });
  });

  it('returns false for invalid relative date filter values', () => {
    expect(isRelativeDateFilterValue('invalid-value')).toBe(false);
    expect(isRelativeDateFilterValue('now-invalid')).toBe(false);
    expect(isRelativeDateFilterValue('now')).toBe(false);
    expect(isRelativeDateFilterValue('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isRelativeDateFilterValue(123)).toBe(false);
    expect(isRelativeDateFilterValue(null)).toBe(false);
    expect(isRelativeDateFilterValue(undefined)).toBe(false);
    expect(isRelativeDateFilterValue({})).toBe(false);
    expect(isRelativeDateFilterValue([])).toBe(false);
  });
});
