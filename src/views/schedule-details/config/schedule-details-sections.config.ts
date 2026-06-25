import { type ScheduleDetailsSectionConfig } from '@/views/schedule-details/schedule-details.types';

import scheduleSpecificationsDetailsConfig from './schedule-specifications-details.config';

const scheduleDetailsSectionsConfig: ScheduleDetailsSectionConfig[] = [
  {
    key: 'specifications',
    title: 'Schedule specifications',
    rowsConfig: scheduleSpecificationsDetailsConfig,
  },
];

export default scheduleDetailsSectionsConfig;
