import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import {
  formatScheduleDuration,
  formatScheduleTimestamp,
} from './schedule-details-formatters';

const scheduleSpecificationsDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'cronExpression',
    getLabel: () => 'Cron expression',
    getValue: ({ describeSchedule }) => describeSchedule.spec?.cronExpression,
    hide: ({ describeSchedule }) => !describeSchedule.spec?.cronExpression,
  },
  {
    key: 'startTime',
    getLabel: () => 'Start time',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.spec?.startTime),
    hide: ({ describeSchedule }) => !describeSchedule.spec?.startTime,
  },
  {
    key: 'endTime',
    getLabel: () => 'End time',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.spec?.endTime),
    hide: ({ describeSchedule }) => !describeSchedule.spec?.endTime,
  },
  {
    key: 'jitter',
    getLabel: () => 'Jitter',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(describeSchedule.spec?.jitter),
    hide: ({ describeSchedule }) => !describeSchedule.spec?.jitter,
  },
];

export default scheduleSpecificationsDetailsConfig;
