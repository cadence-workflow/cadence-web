import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import CronScheduleWithDescription from '@/views/shared/cron-schedule-description/cron-schedule-description';
import WorkflowEventDetailsExecutionLink from '@/views/shared/workflow-event-details-execution-link/workflow-event-details-execution-link';

import WorkflowHistoryEventDetailsTaskListLink from '../../shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';
import { type WorkflowHistoryEventDetailsConfig } from '../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryEventDetailsJson from '../workflow-history-event-details-json/workflow-history-event-details-json';
import WorkflowHistoryEventDetailsPlaceholderText from '../workflow-history-event-details-placeholder-text/workflow-history-event-details-placeholder-text';

const workflowHistoryEventDetailsConfig = [
  {
    name: 'Filter empty value',
    customMatcher: ({ value }) => value === null || value === undefined,
    hide: () => true,
  },
  {
    name: 'Filter unneeded values',
    pathRegex: '(taskId|eventType)$',
    hide: () => true,
  },
  {
    name: 'Not set placeholder',
    customMatcher: ({ value, path }) => {
      return (
        value === 0 &&
        new RegExp(
          '(heartbeatTimeoutSeconds|retryPolicy.(maximumAttempts|expirationIntervalInSeconds))$'
        ).test(path)
      );
    },
    getLabel: ({ key }) => key.replace(/InSeconds|Seconds|$/, ''), // remove seconds suffix from label as formatted duration can be minutes/hours etc.
    valueComponent: () =>
      createElement(WorkflowHistoryEventDetailsPlaceholderText),
  },
  {
    name: 'Date object as time string',
    customMatcher: ({ value }) => value instanceof Date,
    valueComponent: ({ entryValue }) => formatDate(entryValue),
  },
  {
    name: 'Tasklists as links',
    key: 'taskList',
    valueComponent: ({ entryValue, domain, cluster }) => {
      return createElement(WorkflowHistoryEventDetailsTaskListLink, {
        domain: domain,
        cluster: cluster,
        taskList: entryValue,
      });
    },
  },
  {
    name: 'Json as PrettyJson',
    pathRegex:
      '(input|result|details|failureDetails|Error|lastCompletionResult|heartbeatDetails|lastFailureDetails)$',
    valueComponent: WorkflowHistoryEventDetailsJson,
    forceWrap: true,
  },
  {
    name: 'Duration & interval seconds',
    pathRegex: '(TimeoutSeconds|BackoffSeconds|InSeconds)$',
    getLabel: ({ key }) => key.replace(/InSeconds|Seconds|$/, ''), // remove seconds suffix from label as formatted duration can be minutes/hours etc.
    valueComponent: ({ entryValue }) =>
      formatDuration({ seconds: entryValue > 0 ? entryValue : 0, nanos: 0 }),
  },
  {
    name: 'WorkflowExecution as link',
    pathRegex:
      '(parentWorkflowExecution|externalWorkflowExecution|workflowExecution)$',
    valueComponent: ({ entryValue, domain, cluster }) => {
      return createElement(WorkflowEventDetailsExecutionLink, {
        domain,
        cluster,
        workflowId: entryValue?.workflowId,
        runId: entryValue?.runId,
      });
    },
  },
  {
    name: 'RunIds as link',
    pathRegex:
      '(firstExecutionRunId|originalExecutionRunId|newExecutionRunId|continuedExecutionRunId)$',
    valueComponent: ({ entryValue, domain, cluster, workflowId }) => {
      return createElement(WorkflowEventDetailsExecutionLink, {
        domain,
        cluster,
        workflowId,
        runId: entryValue,
      });
    },
  },
  {
    name: 'Retry config attempt as retryAttempt',
    key: 'attempt',
    getLabel: () => 'retryAttempt',
  },
  {
    name: 'Cron schedule with description',
    key: 'cronSchedule',
    valueComponent: ({ entryValue }) =>
      createElement(CronScheduleWithDescription, { cronSchedule: entryValue }),
  },
] as const satisfies WorkflowHistoryEventDetailsConfig[];

export default workflowHistoryEventDetailsConfig;
