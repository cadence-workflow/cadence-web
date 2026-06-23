import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import describeScheduleToNextExecutionMs from '../helpers/describe-schedule-to-next-execution';

describe(describeScheduleToNextExecutionMs.name, () => {
  it('returns next run time in milliseconds', () => {
    const nextExecutionMs = describeScheduleToNextExecutionMs(
      getMockRunningDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: { seconds: '1745490629', nanos: 850000000 },
          totalRuns: '1',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
          ongoingBackfills: [],
        },
      })
    );

    expect(nextExecutionMs).toBe(1745490629850);
  });

  it('returns null when describe has no next run time', () => {
    expect(describeScheduleToNextExecutionMs(undefined)).toBeNull();
  });
});
