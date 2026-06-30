import { createElement } from 'react';

import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

import { formatScheduleCronExpression } from '../helpers/format-schedule-cron-expression';
import { formatScheduleDuration } from '../helpers/format-schedule-duration';
import { formatScheduleTimestamp } from '../helpers/format-schedule-timestamp';
import getScheduleDetailsMapBadgeLabels from '../helpers/get-schedule-details-map-badge-labels';
import ScheduleDetailsBadges from '../schedule-details-badges/schedule-details-badges';

const scheduleSpecificationsDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'scheduleId',
    getLabel: () => 'Schedule ID',
    getValue: ({ scheduleId }) => scheduleId,
  },
  {
    key: 'cronExpression',
    getLabel: () => 'Cron execution',
    getValue: ({ formattedScheduleDetails: { spec } }) =>
      formatScheduleCronExpression(spec?.cronExpression),
  },
  {
    key: 'nextRunTime',
    getLabel: () => 'Next run',
    getValue: ({ formattedScheduleDetails: { info } }) =>
      formatScheduleTimestamp(info?.nextRunTime),
  },
  {
    key: 'lastRunTime',
    getLabel: () => 'Last run',
    getValue: ({ formattedScheduleDetails: { info } }) =>
      formatScheduleTimestamp(info?.lastRunTime),
  },
  {
    key: 'totalRuns',
    getLabel: () => 'Total runs',
    getValue: ({ formattedScheduleDetails: { info } }) => {
      const total = info?.totalRuns || '0';
      return createElement(ScheduleDetailsBadges, {
        labels: [`${total} runs`],
      });
    },
  },
  {
    key: 'createTime',
    getLabel: () => 'Creation time',
    getValue: ({ formattedScheduleDetails: { info } }) =>
      formatScheduleTimestamp(info?.createTime),
    hide: ({ formattedScheduleDetails: { info } }) => !info?.createTime,
  },
  {
    key: 'startTime',
    getLabel: () => 'Start time',
    getValue: ({ formattedScheduleDetails: { spec } }) =>
      formatScheduleTimestamp(spec?.startTime),
    hide: ({ formattedScheduleDetails: { spec } }) => !spec?.startTime,
  },
  {
    key: 'endTime',
    getLabel: () => 'End time',
    getValue: ({ formattedScheduleDetails: { spec } }) =>
      formatScheduleTimestamp(spec?.endTime),
    hide: ({ formattedScheduleDetails: { spec } }) => !spec?.endTime,
  },
  {
    key: 'memo',
    getLabel: () => 'Memo',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      createElement(ScheduleDetailsBadges, {
        labels: getScheduleDetailsMapBadgeLabels(
          action?.startWorkflow?.memo?.fields
        ),
      }),
    hide: ({ formattedScheduleDetails: { action } }) =>
      getScheduleDetailsMapBadgeLabels(action?.startWorkflow?.memo?.fields)
        .length === 0,
  },

  {
    key: 'jitter',
    getLabel: () => 'Jitter duration',
    getValue: ({ formattedScheduleDetails: { spec } }) =>
      formatScheduleDuration(spec?.jitter),
    hide: ({ formattedScheduleDetails: { spec } }) => !spec?.jitter,
  },
];

export default scheduleSpecificationsDetailsConfig;
