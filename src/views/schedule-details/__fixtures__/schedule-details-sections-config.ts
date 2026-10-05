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
          getValue: ({ formattedScheduleDetails: { policies } }) =>
            policies?.overlapPolicy,
        },
        {
          key: 'conditional',
          getLabel: () => 'Conditional row',
          getValue: () => 'conditional-value',
          hide: ({ formattedScheduleDetails: { policies } }) =>
            policies?.overlapPolicy !==
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        },
      ],
    },
  ];
