import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import {
  getExpectedScheduleTimesMs,
  getScheduleTimelineBounds,
  getSkippedScheduleTimesMs,
  MAX_SCHEDULE_CRON_OCCURRENCES,
} from '../get-schedule-cron-timeline';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

describe('schedule cron timeline', () => {
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

  it('uses creation, update, retention, and spec bounds', () => {
    const nowMs = Date.parse('2026-07-26T12:00:00Z');
    const timestamp = (value: string) => ({
      seconds: String(Date.parse(value) / 1000),
      nanos: 0,
    });
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      info: {
        lastRunTime: null,
        nextRunTime: null,
        totalRuns: '0',
        createTime: timestamp('2026-07-01T00:00:00Z'),
        lastUpdateTime: timestamp('2026-07-25T00:00:00Z'),
        missedRuns: '0',
        skippedRuns: '0',
        ongoingBackfills: [],
      },
      spec: {
        cronExpression: '0 * * * *',
        startTime: timestamp('2026-07-24T00:00:00Z'),
        endTime: timestamp('2026-08-01T00:00:00Z'),
        jitter: null,
      },
    });

    expect(
      getScheduleTimelineBounds({
        describeSchedule,
        retentionSeconds: 7 * 24 * 60 * 60,
        nowMs,
      })
    ).toEqual({
      inferenceStartMs: Date.parse('2026-07-25T00:00:00Z'),
      scheduleEndMs: Date.parse('2026-08-01T00:00:00Z'),
    });
  });

  it('matches actual runs within jitter and returns absent slots', () => {
    expect(
      getSkippedScheduleTimesMs({
        expectedTimesMs: [0, HOUR_MS, 2 * HOUR_MS],
        actualTimesMs: [5 * MINUTE_MS, HOUR_MS],
        jitterMs: 10 * MINUTE_MS,
      })
    ).toEqual([2 * HOUR_MS]);
  });

  it('matches each actual run once and prefers exact slots over jitter windows', () => {
    expect(
      getSkippedScheduleTimesMs({
        expectedTimesMs: [0, HOUR_MS],
        actualTimesMs: [HOUR_MS],
        jitterMs: 2 * HOUR_MS,
      })
    ).toEqual([0]);
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
