import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import {
  formatScheduleDuration,
  formatScheduleMemo,
  formatScheduleTimestamp,
} from './schedule-details-formatters';

const scheduleSpecificationsDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'scheduleId',
    getLabel: () => 'Schedule Id',
    getValue: ({ scheduleId }) => scheduleId,
  },
  {
    key: 'createTime',
    getLabel: () => 'Creation time',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.createTime),
    hide: ({ describeSchedule }) => !describeSchedule.info?.createTime,
  },
  {
    key: 'nextRunTime',
    getLabel: () => 'Next run',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.nextRunTime),
    hide: ({ describeSchedule }) => !describeSchedule.info?.nextRunTime,
  },
  {
    key: 'lastRunTime',
    getLabel: () => 'Last run',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.lastRunTime),
    hide: ({ describeSchedule }) => !describeSchedule.info?.lastRunTime,
  },
  {
    key: 'totalRuns',
    getLabel: () => 'Total runs',
    getValue: ({ describeSchedule }) => {
      const total = describeSchedule.info?.totalRuns;
      if (!total) return null;
      return `${total} runs`;
    },
    hide: ({ describeSchedule }) => !describeSchedule.info?.totalRuns,
  },
  {
    key: 'memo',
    getLabel: () => 'Memo',
    getValue: ({ describeSchedule }) =>
      formatScheduleMemo(describeSchedule.memo),
    hide: ({ describeSchedule }) => !describeSchedule.memo?.fields,
  },
  {
    key: 'cronExpression',
    getLabel: () => 'Cron execution',
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
    getLabel: () => 'Jitter duration',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(describeSchedule.spec?.jitter),
    hide: ({ describeSchedule }) => !describeSchedule.spec?.jitter,
  },
];

export default scheduleSpecificationsDetailsConfig;
