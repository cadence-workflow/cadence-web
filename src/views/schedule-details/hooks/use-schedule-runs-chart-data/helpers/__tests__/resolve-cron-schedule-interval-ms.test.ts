import resolveCronScheduleIntervalMs from '../resolve-cron-schedule-interval-ms';

const hourMs = 60 * 60_000;
const mockNowMs = Date.parse('2026-07-26T12:00:00Z');

describe(resolveCronScheduleIntervalMs.name, () => {
  it('returns the cadence between consecutive cron occurrences', () => {
    expect(resolveCronScheduleIntervalMs('0 * * * *', mockNowMs)).toBe(hourMs);
    expect(resolveCronScheduleIntervalMs('*/15 * * * *', mockNowMs)).toBe(
      15 * 60_000
    );
  });

  it('returns null for unsupported or invalid expressions', () => {
    expect(resolveCronScheduleIntervalMs('@every 1m', mockNowMs)).toBeNull();
    expect(resolveCronScheduleIntervalMs('', mockNowMs)).toBeNull();
  });
});
