import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type ScheduleDetailRowConfig } from '../../schedule-details.types';
import { getRowsFromConfig } from '../get-rows-from-config';

describe(getRowsFromConfig.name, () => {
  const describeSchedule = getMockRunningDescribeScheduleResponse({
    policies: {
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
    },
  } as Partial<DescribeScheduleResponse>);
  const scheduleId = 'my-schedule';

  it('maps row config to table rows', () => {
    const config: ScheduleDetailRowConfig[] = [
      {
        key: 'overlap',
        getLabel: () => 'Overlap',
        getValue: ({ scheduleId: id }) => `${id}-value`,
      },
    ];

    expect(getRowsFromConfig(config, describeSchedule, scheduleId)).toEqual([
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

    expect(getRowsFromConfig(config, describeSchedule, scheduleId)).toEqual([
      { key: 'visible', label: 'Visible', value: 'shown' },
    ]);
  });

  it('passes describeSchedule and scheduleId to hide predicate', () => {
    const config: ScheduleDetailRowConfig[] = [
      {
        key: 'conditional',
        getLabel: () => 'Conditional',
        getValue: () => 'value',
        hide: ({ describeSchedule: data, scheduleId: id }) =>
          data.policies?.overlapPolicy !==
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER ||
          id !== 'my-schedule',
      },
    ];

    expect(getRowsFromConfig(config, describeSchedule, scheduleId)).toEqual([
      { key: 'conditional', label: 'Conditional', value: 'value' },
    ]);
    expect(getRowsFromConfig(config, describeSchedule, 'other-id')).toEqual([]);
  });
});
