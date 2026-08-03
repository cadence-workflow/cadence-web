import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import getScheduleTimelineBounds from '../get-schedule-timeline-bounds';

describe(getScheduleTimelineBounds.name, () => {
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
});
