import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import WorkflowHistoryEventDetailsExecutionLink from '@/views/shared/workflow-history-event-details-wf-execution-link/workflow-history-event-details-wf-execution-link';

import WorkflowHistoryEventDetailsTaskListLink from '../../shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';
import { type WorkflowHistoryEventDetailsConfig } from '../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryEventDetailsJson from '../workflow-history-event-details-json/workflow-history-event-details-json';

const workflowHistoryEventDetailsConfig = [
  {
    name: 'Filter empty value',
    customMatcher: ({ value }) => value === null || value === undefined,
    hide: () => true,
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
    pathRegex: '(input|result|details|Error)$',
    valueComponent: WorkflowHistoryEventDetailsJson,
    forceWrap: true,
  },
  {
    name: 'Duration timeout & backoff seconds',
    pathRegex: '(TimeoutSeconds|BackoffSeconds)$',
    valueComponent: ({ entryValue }) => `${entryValue}s`, // TODO @assem.hafez: format the value as duration
  },
  {
    name: 'WorkflowExecution as link',
    pathRegex:
      '(parentWorkflowExecution|externalWorkflowExecution|workflowExecution)$',
    valueComponent: ({ entryValue, domain, cluster }) => {
      return createElement(WorkflowHistoryEventDetailsExecutionLink, {
        domain,
        cluster,
        workflowId: entryValue?.workflowId,
        runId: entryValue?.runId,
      });
    },
  },
  {
    name: 'RunIds as link',
    pathRegex: '(firstExecutionRunId|originalExecutionRunId)$',
    valueComponent: ({ entryValue, domain, cluster, workflowId }) => {
      return createElement(WorkflowHistoryEventDetailsExecutionLink, {
        domain,
        cluster,
        workflowId,
        runId: entryValue,
      });
    },
  },
] as const satisfies WorkflowHistoryEventDetailsConfig[];

export default workflowHistoryEventDetailsConfig;
