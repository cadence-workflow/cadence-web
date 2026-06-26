import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { type ScheduleDetailsSectionConfig } from '../schedule-details.types';

export const mockScheduleDetailsSectionsConfig: ScheduleDetailsSectionConfig[] =
  [
    {
      key: 'mock-section',
      title: 'Mock policies section',
      rowsConfig: [
        {
          key: 'primary',
          getLabel: () => 'Primary row',
          getValue: ({ describeSchedule }) =>
            describeSchedule.policies?.overlapPolicy,
        },
        {
          key: 'conditional',
          getLabel: () => 'Conditional row',
          getValue: () => 'conditional-value',
          hide: ({ describeSchedule }) =>
            describeSchedule.policies?.overlapPolicy !==
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        },
      ],
    },
  ];
