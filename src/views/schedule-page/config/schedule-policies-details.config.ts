import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import {
  formatBooleanValue,
  formatScheduleDuration,
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
    hide: ({ describeSchedule }) =>
      !describeSchedule.policies?.overlapPolicy ||
      describeSchedule.policies?.overlapPolicy ===
        'SCHEDULE_OVERLAP_POLICY_INVALID',
  },
  {
    key: 'catchUpPolicy',
    getLabel: () => 'Catch-up policy',
    getValue: ({ describeSchedule }) =>
      formatScheduleEnum(
        describeSchedule.policies?.catchUpPolicy,
        'SCHEDULE_CATCH_UP_POLICY'
      ),
    hide: ({ describeSchedule }) =>
      !describeSchedule.policies?.catchUpPolicy ||
      describeSchedule.policies?.catchUpPolicy ===
        'SCHEDULE_CATCH_UP_POLICY_INVALID',
  },
  {
    key: 'catchUpWindow',
    getLabel: () => 'Catch-up window',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(describeSchedule.policies?.catchUpWindow),
    hide: ({ describeSchedule }) => !describeSchedule.policies?.catchUpWindow,
  },
  {
    key: 'pauseOnFailure',
    getLabel: () => 'Pause on failure',
    getValue: ({ describeSchedule }) =>
      formatBooleanValue(describeSchedule.policies?.pauseOnFailure),
    hide: ({ describeSchedule }) => !describeSchedule.policies,
  },
  {
    key: 'bufferLimit',
    getLabel: () => 'Buffer limit',
    getValue: ({ describeSchedule }) => describeSchedule.policies?.bufferLimit,
    hide: ({ describeSchedule }) =>
      !describeSchedule.policies ||
      !describeSchedule.policies.bufferLimit ||
      describeSchedule.policies.bufferLimit <= 0,
  },
  {
    key: 'concurrencyLimit',
    getLabel: () => 'Concurrency limit',
    getValue: ({ describeSchedule }) =>
      describeSchedule.policies?.concurrencyLimit,
    hide: ({ describeSchedule }) =>
      !describeSchedule.policies ||
      !describeSchedule.policies.concurrencyLimit ||
      describeSchedule.policies.concurrencyLimit <= 0,
  },
];

export default schedulePoliciesDetailsConfig;
