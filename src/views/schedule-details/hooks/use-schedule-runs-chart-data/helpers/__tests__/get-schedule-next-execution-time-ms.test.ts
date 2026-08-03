import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import getScheduleNextExecutionTimeMs from '../get-schedule-next-execution-time-ms';

describe(getScheduleNextExecutionTimeMs.name, () => {
  it('returns nextRunTime in milliseconds for a running schedule', () => {
    const nextRunTimeMs = Date.parse('2026-07-26T13:00:00Z');

    expect(
      getScheduleNextExecutionTimeMs(
        getMockRunningDescribeScheduleResponse({
          info: {
            lastRunTime: null,
            nextRunTime: {
              seconds: String(nextRunTimeMs / 1000),
              nanos: 0,
            },
            totalRuns: '0',
            createTime: null,
            lastUpdateTime: null,
            missedRuns: '0',
            skippedRuns: '0',
            ongoingBackfills: [],
          },
        })
      )
    ).toBe(nextRunTimeMs);
  });

  it('returns null for a paused schedule or invalid nextRunTime', () => {
    expect(
      getScheduleNextExecutionTimeMs(
        getMockRunningDescribeScheduleResponse({
          state: { paused: true, pauseInfo: null },
        })
      )
    ).toBeNull();
    expect(
      getScheduleNextExecutionTimeMs(
        getMockRunningDescribeScheduleResponse({
          info: {
            lastRunTime: null,
            nextRunTime: { seconds: 'not-a-number', nanos: 0 },
            totalRuns: '0',
            createTime: null,
            lastUpdateTime: null,
            missedRuns: '0',
            skippedRuns: '0',
            ongoingBackfills: [],
          },
        })
      )
    ).toBeNull();
  });
});
