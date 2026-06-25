import { formatScheduleLimitValue } from '../schedule-details-formatters';

describe(formatScheduleLimitValue.name, () => {
  it('returns unlimited label when limit is unset or zero', () => {
    expect(formatScheduleLimitValue(undefined)).toBe('0 (Unlimited)');
    expect(formatScheduleLimitValue(null)).toBe('0 (Unlimited)');
    expect(formatScheduleLimitValue(0)).toBe('0 (Unlimited)');
  });

  it('returns the limit as a string when set', () => {
    expect(formatScheduleLimitValue(10)).toBe('10');
  });
});
