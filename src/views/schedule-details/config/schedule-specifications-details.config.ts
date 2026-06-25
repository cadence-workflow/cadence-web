import { createElement } from 'react';

import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

import ScheduleDetailsBadges from '../schedule-details-badges/schedule-details-badges';
import ScheduleDetailsMemo from '../schedule-details-memo/schedule-details-memo';
import {
  formatScheduleCronExpression,
  formatScheduleDuration,
  formatScheduleTimestamp,
} from '../helpers/schedule-details-formatters';

const scheduleSpecificationsDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'scheduleId',
    getLabel: () => 'Schedule Id',
    getValue: ({ scheduleId }) => scheduleId,
  },
  {
    key: 'cronExpression',
    getLabel: () => 'Cron execution',
    getValue: ({ describeSchedule }) =>
      formatScheduleCronExpression(describeSchedule.spec?.cronExpression),
  },
  {
    key: 'nextRunTime',
    getLabel: () => 'Next run',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.nextRunTime),
  },
  {
    key: 'lastRunTime',
    getLabel: () => 'Last run',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.lastRunTime),
  },
  {
    key: 'totalRuns',
    getLabel: () => 'Total runs',
    getValue: ({ describeSchedule }) => {
      const total = describeSchedule.info?.totalRuns;
      if (!total) return null;
      return createElement(ScheduleDetailsBadges, { labels: [`${total} runs`] });
    },
  },
  {
    key: 'createTime',
    getLabel: () => 'Creation time',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.info?.createTime),
    hide: ({ describeSchedule }) => !describeSchedule.info?.createTime,
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
    key: 'memo',
    getLabel: () => 'Memo',
    getValue: ({ describeSchedule }) =>
      createElement(ScheduleDetailsMemo, { memo: describeSchedule.memo }),
    hide: ({ describeSchedule }) => !describeSchedule.memo?.fields,
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
