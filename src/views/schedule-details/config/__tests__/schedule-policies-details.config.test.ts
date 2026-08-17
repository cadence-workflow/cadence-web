import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import schedulePoliciesDetailsConfig from '../schedule-policies-details.config';
import { formatScheduleDetails } from '../../helpers/format-schedule-details';

describe('schedulePoliciesDetailsConfig', () => {
  it('formats the catch-up window', () => {
    const formattedScheduleDetails = formatScheduleDetails(
      getMockRunningDescribeScheduleResponse({
        policies: {
          overlapPolicy:
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW,
          catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL,
          catchUpWindow: { seconds: '89856', nanos: 0 },
          pauseOnFailure: false,
          bufferLimit: 0,
          concurrencyLimit: 0,
        },
      })
    );
    const row = schedulePoliciesDetailsConfig.find(
      ({ key }) => key === 'catchUpWindow'
    );

    expect(row?.getLabel()).toBe('Catch-up window');
    expect(
      row?.getValue({
        formattedScheduleDetails,
        scheduleId: 'schedule-id',
        domain: 'domain',
        cluster: 'cluster',
      })
    ).toBe('1d, 57m, 36s');
  });
});
