import { createElement } from 'react';

import ScheduleDetailsBadges from '@/views/schedule-details/schedule-details-badges/schedule-details-badges';
import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';
import WorkflowHistoryEventDetailsTaskListLink from '@/views/shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';

import { formatScheduleDuration } from '../helpers/format-schedule-duration';
import getScheduleDetailsMapBadgeLabels from '../helpers/get-schedule-details-map-badge-labels';
import ScheduleDetailsJsonView from '../schedule-details-json-view/schedule-details-json-view';

const scheduleActionDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'workflowType',
    getLabel: () => 'Workflow type',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      action?.startWorkflow?.workflowType?.name,
  },
  {
    key: 'taskList',
    getLabel: () => 'Task list',
    getValue: ({ formattedScheduleDetails: { action }, domain, cluster }) => {
      const taskList = action?.startWorkflow?.taskList;
      if (!taskList) return null;

      return createElement(WorkflowHistoryEventDetailsTaskListLink, {
        domain,
        cluster,
        taskList,
      });
    },
  },
  {
    key: 'taskStartToCloseTimeout',
    getLabel: () => 'Task start to close timeout',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      formatScheduleDuration(action?.startWorkflow?.taskStartToCloseTimeout),
  },
  {
    key: 'executionStartToCloseTimeout',
    getLabel: () => 'Execution start to close timeout',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      formatScheduleDuration(
        action?.startWorkflow?.executionStartToCloseTimeout
      ),
  },
  {
    key: 'workflowIdPrefix',
    getLabel: () => 'Workflow ID prefix',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      action?.startWorkflow?.workflowIdPrefix,
    hide: ({ formattedScheduleDetails: { action } }) =>
      !action?.startWorkflow?.workflowIdPrefix,
  },
  {
    key: 'scheduleSearchAttributes',
    getLabel: () => 'Search attributes',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      createElement(ScheduleDetailsBadges, {
        labels: getScheduleDetailsMapBadgeLabels(
          action?.startWorkflow?.searchAttributes?.indexedFields
        ),
      }),
    hide: ({ formattedScheduleDetails: { action } }) =>
      getScheduleDetailsMapBadgeLabels(
        action?.startWorkflow?.searchAttributes?.indexedFields
      ).length === 0,
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
    key: 'retryPolicy',
    getLabel: () => 'Retry policy',
    getValue: ({ formattedScheduleDetails: { action } }) =>
      createElement(ScheduleDetailsJsonView, {
        json: action?.startWorkflow?.retryPolicy ?? null,
      }),
    hide: ({ formattedScheduleDetails: { action } }) =>
      !action?.startWorkflow?.retryPolicy,
  },
];

export default scheduleActionDetailsConfig;
