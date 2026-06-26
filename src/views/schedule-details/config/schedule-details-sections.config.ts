import { type ScheduleDetailsSectionConfig } from '@/views/schedule-details/schedule-details.types';

import schedulePoliciesDetailsConfig from './schedule-policies-details.config';

const scheduleDetailsSectionsConfig: ScheduleDetailsSectionConfig[] = [
  {
    key: 'policies',
    title: 'Schedule policies',
    rowsConfig: schedulePoliciesDetailsConfig,
  },
];

export default scheduleDetailsSectionsConfig;
