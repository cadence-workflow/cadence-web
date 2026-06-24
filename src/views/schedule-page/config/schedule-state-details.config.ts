import { createElement } from 'react';

import ScheduleStatusTag from '@/views/shared/schedule-status-tag/schedule-status-tag';

import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import { formatScheduleTimestamp } from './schedule-details-formatters';

const scheduleStateDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'status',
    getLabel: () => 'Status',
    getValue: ({ describeSchedule }) =>
      createElement(ScheduleStatusTag, {
        paused: Boolean(describeSchedule.state?.paused),
      }),
  },
  {
    key: 'pausedAt',
    getLabel: () => 'Paused at',
    getValue: ({ describeSchedule }) =>
      formatScheduleTimestamp(describeSchedule.state?.pauseInfo?.pausedAt),
    hide: ({ describeSchedule }) => !describeSchedule.state?.pauseInfo?.pausedAt,
  },
  {
    key: 'pausedBy',
    getLabel: () => 'Paused by',
    getValue: ({ describeSchedule }) => describeSchedule.state?.pauseInfo?.pausedBy,
    hide: ({ describeSchedule }) => !describeSchedule.state?.pauseInfo?.pausedBy,
  },
  {
    key: 'pauseReason',
    getLabel: () => 'Pause reason',
    getValue: ({ describeSchedule }) => describeSchedule.state?.pauseInfo?.reason,
    hide: ({ describeSchedule }) => !describeSchedule.state?.pauseInfo?.reason,
  },
];

export default scheduleStateDetailsConfig;
