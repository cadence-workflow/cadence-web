import parseCronExpression from '../parse-cron-expression';

describe(parseCronExpression.name, () => {
  it('returns the expression and UTC when no CRON_TZ prefix is present', () => {
    expect(parseCronExpression('0 12 * * *')).toEqual({
      expression: '0 12 * * *',
      timezone: 'UTC',
    });
  });

  it('strips a CRON_TZ prefix and returns the timezone', () => {
    expect(parseCronExpression('CRON_TZ=America/New_York 30 1 * * *')).toEqual({
      expression: '30 1 * * *',
      timezone: 'America/New_York',
    });
  });

  it('falls back to UTC when CRON_TZ names an unrecognized timezone', () => {
    expect(parseCronExpression('CRON_TZ=Not/AZone 0 5 * * 0')).toEqual({
      expression: '0 5 * * 0',
      timezone: 'UTC',
    });
  });

  it('returns null for unsupported expressions', () => {
    expect(parseCronExpression('@every 1m')).toBeNull();
  });
});
