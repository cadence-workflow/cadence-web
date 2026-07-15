import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type ScheduleDetailRowConfig } from '../../schedule-details.types';
import { formatScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/format-schedule-details';
import { getRowsFromConfig } from '../get-rows-from-config';

describe(getRowsFromConfig.name, () => {
  const describeSchedule = getMockRunningDescribeScheduleResponse({
    policies: {
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
    },
  } as Partial<DescribeScheduleResponse>);
  const scheduleId = 'my-schedule';
  const domain = 'test-domain';
  const cluster = 'test-cluster';
  const formattedScheduleDetails = formatScheduleDetails(describeSchedule);

  it('maps row config to table rows', () => {
    const config: ScheduleDetailRowConfig[] = [
      {
        key: 'overlap',
        getLabel: () => 'Overlap',
        getValue: ({ scheduleId: id }) => `${id}-value`,
      },
    ];

    expect(
      getRowsFromConfig(
        config,
        formattedScheduleDetails,
        scheduleId,
        domain,
        cluster
      )
    ).toEqual([
      { key: 'overlap', label: 'Overlap', value: 'my-schedule-value' },
    ]);
  });

  it('filters out rows when hide returns true', () => {
    const config: ScheduleDetailRowConfig[] = [
      {
        key: 'visible',
        getLabel: () => 'Visible',
        getValue: () => 'shown',
      },
      {
        key: 'hidden',
        getLabel: () => 'Hidden',
        getValue: () => 'hidden',
        hide: () => true,
      },
    ];

    expect(
      getRowsFromConfig(
        config,
        formattedScheduleDetails,
        scheduleId,
        domain,
        cluster
      )
    ).toEqual([{ key: 'visible', label: 'Visible', value: 'shown' }]);
  });

  it('passes formatted schedule details to hide predicate', () => {
    const hide = jest.fn(() => false);
    const config: ScheduleDetailRowConfig[] = [
      {
        key: 'conditional',
        getLabel: () => 'Conditional',
        getValue: () => 'value',
        hide,
      },
    ];

    getRowsFromConfig(
      config,
      formattedScheduleDetails,
      scheduleId,
      domain,
      cluster
    );

    expect(hide).toHaveBeenCalledWith({
      formattedScheduleDetails,
      scheduleId,
      domain,
      cluster,
    });
  });
});
