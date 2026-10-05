import { formatScheduleCronExpression } from '../format-schedule-cron-expression';

describe(formatScheduleCronExpression.name, () => {
  it('returns null for empty input', () => {
    expect(formatScheduleCronExpression(null)).toBeNull();
    expect(formatScheduleCronExpression(undefined)).toBeNull();
    expect(formatScheduleCronExpression('')).toBeNull();
  });

  it('appends UTC for expressions without a CRON_TZ prefix', () => {
    expect(formatScheduleCronExpression('0 5 * * 0')).toBe(
      'At 05:00 AM, only on Sunday (0 5 * * 0), UTC'
    );
  });

  it('appends the parsed timezone for CRON_TZ-prefixed expressions', () => {
    expect(
      formatScheduleCronExpression('CRON_TZ=America/New_York 0 5 * * 0')
    ).toBe('At 05:00 AM, only on Sunday (0 5 * * 0), America/New_York');
  });

  it('returns the raw expression when parsing fails', () => {
    expect(formatScheduleCronExpression('invalid-cron')).toBe('invalid-cron');
  });

  it('falls back to UTC when CRON_TZ names an unrecognized timezone', () => {
    expect(formatScheduleCronExpression('CRON_TZ=Not/AZone 0 5 * * 0')).toBe(
      'At 05:00 AM, only on Sunday (0 5 * * 0), UTC'
    );
  });
});
