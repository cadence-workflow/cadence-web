import { createElement } from 'react';

import SchedulePageSearchAttributesTags from '../schedule-page-search-attributes-tags/schedule-page-search-attributes-tags';

import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import { formatScheduleDuration } from './schedule-details-formatters';

const scheduleActionDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'workflowIdPrefix',
    getLabel: () => 'Workflow Id Prefix',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.workflowIdPrefix,
  },
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
    key: 'retryPolicy',
    getLabel: () => 'Retry policy',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.retryPolicy ? 'Configured' : null,
  },
  {
    key: 'scheduleSearchAttributes',
    getLabel: () => 'Schedule Search attributes',
    getValue: ({ describeSchedule }) => {
      const indexedFields = describeSchedule.searchAttributes?.indexedFields;
      if (!indexedFields || Object.keys(indexedFields).length === 0) return null;
      return createElement(SchedulePageSearchAttributesTags, { indexedFields });
    },
  },
];

export default scheduleActionDetailsConfig;
