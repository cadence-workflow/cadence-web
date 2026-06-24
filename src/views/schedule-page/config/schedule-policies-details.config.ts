import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import {
  formatBooleanValue,
  formatScheduleEnum,
} from './schedule-details-formatters';

const schedulePoliciesDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'overlapPolicy',
    getLabel: () => 'Overlap policy',
    getValue: ({ describeSchedule }) =>
      formatScheduleEnum(
        describeSchedule.policies?.overlapPolicy,
        'SCHEDULE_OVERLAP_POLICY'
      ),
  },
  {
    key: 'catchUpPolicy',
    getLabel: () => 'Catchup policy',
    getValue: ({ describeSchedule }) =>
      formatScheduleEnum(
        describeSchedule.policies?.catchUpPolicy,
        'SCHEDULE_CATCH_UP_POLICY'
      ),
  },
  {
    key: 'pauseOnFailure',
    getLabel: () => 'Pause on failure',
    getValue: ({ describeSchedule }) =>
      formatBooleanValue(describeSchedule.policies?.pauseOnFailure),
  },
  {
    key: 'bufferLimit',
    getLabel: () => 'Buffer limit',
    getValue: ({ describeSchedule }) => describeSchedule.policies?.bufferLimit,
  },
  {
    key: 'concurrencyLimit',
    getLabel: () => 'Concurrency limit',
    getValue: ({ describeSchedule }) =>
      describeSchedule.policies?.concurrencyLimit,
  },
];

export default schedulePoliciesDetailsConfig;
