import getScheduleCronExpressionParts from '../get-schedule-cron-expression-parts';

describe(getScheduleCronExpressionParts.name, () => {
  it('defaults the timezone to UTC for expressions without a CRON_TZ prefix', () => {
    expect(getScheduleCronExpressionParts('0 5 * * 0')).toEqual({
      expression: '0 5 * * 0',
      description: 'At 05:00, only on Sunday',
      timezone: 'UTC',
    });
  });

  it('returns the parsed timezone for CRON_TZ-prefixed expressions', () => {
    expect(
      getScheduleCronExpressionParts('CRON_TZ=America/New_York 0 5 * * 0')
    ).toEqual({
      expression: '0 5 * * 0',
      description: 'At 05:00, only on Sunday',
      timezone: 'America/New_York',
    });
  });

  it('describes times in 24-hour format', () => {
    expect(getScheduleCronExpressionParts('0 17 * * 0')?.description).toBe(
      'At 17:00, only on Sunday'
    );
  });

  it('returns null when parsing fails', () => {
    expect(getScheduleCronExpressionParts('invalid-cron')).toBeNull();
  });

  it('falls back to UTC when CRON_TZ names an unrecognized timezone', () => {
    expect(
      getScheduleCronExpressionParts('CRON_TZ=Not/AZone 0 5 * * 0')?.timezone
    ).toBe('UTC');
  });
});
