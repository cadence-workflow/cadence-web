import getExpectedScheduleTimesMs from '../get-expected-schedule-times-ms';
import { MAX_SCHEDULE_CRON_OCCURRENCES } from '../get-expected-schedule-times-ms.constants';

const MINUTE_MS = 60_000;

describe(getExpectedScheduleTimesMs.name, () => {
  it('iterates Cadence cron expressions within an inclusive range', () => {
    expect(
      getExpectedScheduleTimesMs({
        cronExpression: '*/15 * * * *',
        startMs: Date.parse('2026-07-26T12:00:00Z'),
        endMs: Date.parse('2026-07-26T12:30:00Z'),
      })
    ).toEqual([
      Date.parse('2026-07-26T12:00:00Z'),
      Date.parse('2026-07-26T12:15:00Z'),
      Date.parse('2026-07-26T12:30:00Z'),
    ]);
  });

  it('honors CRON_TZ and daylight-saving transitions', () => {
    expect(
      getExpectedScheduleTimesMs({
        cronExpression: 'CRON_TZ=America/New_York 30 1 * * *',
        startMs: Date.parse('2026-10-31T00:00:00Z'),
        endMs: Date.parse('2026-11-02T23:59:59Z'),
      })
    ).toEqual([
      Date.parse('2026-10-31T05:30:00Z'),
      Date.parse('2026-11-01T05:30:00Z'),
      Date.parse('2026-11-02T06:30:00Z'),
    ]);
  });

  it('rejects unsupported expressions and caps occurrence generation', () => {
    expect(
      getExpectedScheduleTimesMs({
        cronExpression: '@every 1m',
        startMs: 0,
        endMs: 10 * MINUTE_MS,
      })
    ).toEqual([]);
    const cappedOccurrences = getExpectedScheduleTimesMs({
      cronExpression: '* * * * *',
      startMs: 0,
      endMs: (MAX_SCHEDULE_CRON_OCCURRENCES + 1) * MINUTE_MS,
    });

    expect(cappedOccurrences).toHaveLength(MAX_SCHEDULE_CRON_OCCURRENCES);
    expect(cappedOccurrences.at(-1)).toBe(
      (MAX_SCHEDULE_CRON_OCCURRENCES + 1) * MINUTE_MS
    );
  });
});
