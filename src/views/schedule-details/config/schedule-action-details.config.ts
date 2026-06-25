import { createElement } from 'react';

import ScheduleDetailsBadges from '@/views/schedule-details/schedule-details-badges/schedule-details-badges';
import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

import { formatScheduleDuration } from '../helpers/schedule-details-formatters';
import scheduleRetryPolicyDetailsConfig from './schedule-retry-policy-details.config';

const scheduleActionDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'workflowType',
    getLabel: () => 'Workflow type',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.workflowType?.name,
  },
  {
    key: 'taskList',
    getLabel: () => 'Tasklist',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.taskList?.name,
  },
  {
    key: 'taskStartToCloseTimeout',
    getLabel: () => 'Task start to close timeout',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.taskStartToCloseTimeout
      ),
  },
  {
    key: 'executionStartToCloseTimeout',
    getLabel: () => 'Execution start to close timeout',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.executionStartToCloseTimeout
      ),
  },
  {
    key: 'workflowIdPrefix',
    getLabel: () => 'Workflow Id Prefix',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.workflowIdPrefix,
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.workflowIdPrefix,
  },
  ...scheduleRetryPolicyDetailsConfig,
  {
    key: 'scheduleSearchAttributes',
    getLabel: () => 'Schedule Search attributes',
    getValue: ({ describeSchedule }) => {
      const indexedFields =
        describeSchedule.searchAttributes?.indexedFields ?? {};
      if (Object.keys(indexedFields).length === 0) return null;
      return createElement(ScheduleDetailsBadges, {
        labels: Object.keys(indexedFields),
      });
    },
    hide: ({ describeSchedule }) => {
      return !Object.keys(
        describeSchedule.searchAttributes?.indexedFields ?? {}
      ).length;
    },
  },
];

export default scheduleActionDetailsConfig;
