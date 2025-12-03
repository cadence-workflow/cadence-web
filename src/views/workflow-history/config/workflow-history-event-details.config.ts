import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import WorkflowEventDetailsExecutionLink from '@/views/shared/workflow-event-details-execution-link/workflow-event-details-execution-link';

import WorkflowHistoryEventDetailsTaskListLink from '../../shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';
import { type WorkflowHistoryEventDetailsConfig } from '../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryEventDetailsJson from '../workflow-history-event-details-json/workflow-history-event-details-json';
import WorkflowHistoryEventDetailsPlaceholderText from '../workflow-history-event-details-placeholder-text/workflow-history-event-details-placeholder-text';

/**
 * Configuration array for customizing how workflow history event details are rendered.
 * Each config entry defines matching criteria and rendering behavior for specific event fields.
 * Configs are evaluated in order, and the first matching config is applied to each field.
 */
const workflowHistoryEventDetailsConfig = [
  /**
   * Hides fields with null or undefined values from the event details display.
   */
  {
    name: 'Filter empty value',
    customMatcher: ({ value }) => value === null || value === undefined,
    hide: () => true,
  },
  /**
   * Hides internal fields (taskId, eventType) that are not useful for display.
   */
  {
    name: 'Filter unneeded values',
    pathRegex: '(taskId|eventType)$',
    hide: () => true,
  },
  /**
   * Displays a placeholder text for timeout/retry fields that are set to 0 (not configured).
   * Also removes the "Seconds" suffix from labels since formatted durations may be in minutes/hours.
   */
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
  /**
   * Formats Date objects as human-readable time strings.
   */
  {
    name: 'Date object as time string',
    customMatcher: ({ value }) => value instanceof Date,
    valueComponent: ({ entryValue }) => formatDate(entryValue),
  },
  /**
   * Renders task list names as clickable links that navigate to the task list view.
   */
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
  /**
   * Renders JSON fields (input, result, details, etc.) as formatted PrettyJson components.
   * Uses forceWrap to ensure proper wrapping of long JSON content.
   */
  {
    name: 'Json as PrettyJson',
    pathRegex:
      '(input|result|details|failureDetails|Error|lastCompletionResult|heartbeatDetails|lastFailureDetails)$',
    valueComponent: WorkflowHistoryEventDetailsJson,
    forceWrap: true,
  },
  /**
   * Formats duration fields (ending in TimeoutSeconds, BackoffSeconds, or InSeconds) as human-readable durations.
   * Removes the "Seconds" suffix from labels since formatted durations may be in minutes/hours.
   */
  {
    name: 'Duration & interval seconds',
    pathRegex: '(TimeoutSeconds|BackoffSeconds|InSeconds)$',
    getLabel: ({ key }) => key.replace(/InSeconds|Seconds|$/, ''), // remove seconds suffix from label as formatted duration can be minutes/hours etc.
    valueComponent: ({ entryValue }) =>
      formatDuration({ seconds: entryValue > 0 ? entryValue : 0, nanos: 0 }),
  },
  /**
   * Renders workflow execution objects as clickable links that navigate to the workflow view.
   * Applies to parentWorkflowExecution, externalWorkflowExecution, and workflowExecution fields.
   */
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
  /**
   * Renders run ID fields as clickable links that navigate to the corresponding workflow run.
   * Applies to firstExecutionRunId, originalExecutionRunId, newExecutionRunId, and continuedExecutionRunId.
   */
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
  /**
   * Renames the "attempt" field label to "retryAttempt" for better clarity.
   */
  {
    name: 'Retry config attempt as retryAttempt',
    key: 'attempt',
    getLabel: () => 'retryAttempt',
  },
] as const satisfies WorkflowHistoryEventDetailsConfig[];

export default workflowHistoryEventDetailsConfig;
