import { type ScheduleDetailsSectionConfig } from '@/views/schedule-details/schedule-details.types';

import scheduleActionDetailsConfig from './schedule-action-details.config';
import scheduleSpecificationsDetailsConfig from './schedule-specifications-details.config';

const scheduleDetailsSectionsConfig: ScheduleDetailsSectionConfig[] = [
  {
    key: 'specifications',
    title: 'Schedule specifications',
    rowsConfig: scheduleSpecificationsDetailsConfig,
  },
  {
    key: 'action',
    title: 'Schedule action',
    rowsConfig: scheduleActionDetailsConfig,
  },
];

export default scheduleDetailsSectionsConfig;
