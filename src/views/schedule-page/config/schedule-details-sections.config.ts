import { type ScheduleDetailsSectionConfig } from './schedule-detail-sections.types';
import scheduleActionDetailsConfig from './schedule-action-details.config';
import schedulePoliciesDetailsConfig from './schedule-policies-details.config';
import scheduleSpecificationsDetailsConfig from './schedule-specifications-details.config';
import scheduleStateDetailsConfig from './schedule-state-details.config';

const scheduleDetailsSectionsConfig: ScheduleDetailsSectionConfig[] = [
  {
    key: 'specifications',
    title: 'Specifications',
    rowsConfig: scheduleSpecificationsDetailsConfig,
  },
  {
    key: 'policies',
    title: 'Policies',
    rowsConfig: schedulePoliciesDetailsConfig,
  },
  {
    key: 'action',
    title: 'Action',
    rowsConfig: scheduleActionDetailsConfig,
  },
  {
    key: 'state',
    title: 'State',
    rowsConfig: scheduleStateDetailsConfig,
  },
];

export default scheduleDetailsSectionsConfig;
