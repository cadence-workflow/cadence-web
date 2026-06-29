import getDisplayValue from '../get-display-value';

describe(getDisplayValue.name, () => {
  it('returns emptyValue for null, undefined, and blank strings', () => {
    expect(getDisplayValue(null, '-')).toBe('-');
    expect(getDisplayValue(undefined, '-')).toBe('-');
    expect(getDisplayValue('', '-')).toBe('-');
    expect(getDisplayValue('   ', '-')).toBe('-');
  });

  it('returns the value when present', () => {
    expect(getDisplayValue('Daily schedule', '-')).toBe('Daily schedule');
    expect(getDisplayValue(0, '-')).toBe(0);
  });
});
