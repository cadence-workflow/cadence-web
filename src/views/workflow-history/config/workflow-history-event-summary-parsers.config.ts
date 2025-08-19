import { createElement } from 'react';

import {
  MdLabelImportantOutline,
  MdOutlineMonitorHeart,
  MdOutlineTimer,
} from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import formatDuration from '@/utils/data-formatters/format-duration';
import WorkflowEventDetailsExecutionLink from '@/views/shared/workflow-event-details-execution-link/workflow-event-details-execution-link';

import { type WorkflowHistoryEventSummaryRenderConfig } from '../workflow-history-event-summary/workflow-history-event-summary.types';
import WorkflowHistoryEventSummaryJson from '../workflow-history-event-summary-json/workflow-history-event-summary-json';
import WorkflowHistoryEventSummaryJsonPreview from '../workflow-history-event-summary-json-preview/workflow-history-event-summary-json-preview';

const workflowHistoryEventSummaryParsersConfig: Array<WorkflowHistoryEventSummaryRenderConfig> =
  [
    {
      name: 'Heartbeat time as formatted date',
      matcher: (name) => name === 'lastHeartbeatTime',
      icon: MdOutlineMonitorHeart,
      renderValue: ({ value }) => formatDate(value),
    },
    {
      name: 'Json as PrettyJson',
      matcher: (name) =>
        new RegExp(
          '(input|result|details|failureDetails|Error|lastCompletionResult|heartbeatDetails)$'
        ).test(name),
      icon: null,
      renderValue: WorkflowHistoryEventSummaryJson,
      renderHoverContent: WorkflowHistoryEventSummaryJsonPreview,
      invertPopoverColours: true,
      shouldHide: ({ value }) => value === null,
    },

    {
      name: 'Duration & interval seconds',
      matcher: (name) =>
        new RegExp('(TimeoutSeconds|BackoffSeconds|InSeconds)$').test(name),
      icon: MdOutlineTimer,
      renderValue: ({ value }) =>
        formatDuration({
          seconds: value > 0 ? value : 0,
          nanos: 0,
        }),
      renderHoverContent: ({ name }) => name.replace(/InSeconds|Seconds|$/, ''), // remove seconds suffix from label as formatted duration can be minutes/hours etc.
    },
    {
      name: 'WorkflowExecution as link',
      matcher: (name) =>
        new RegExp(
          '(parentWorkflowExecution|externalWorkflowExecution|workflowExecution)$'
        ).test(name),
      icon: MdLabelImportantOutline,
      renderValue: ({ value, domain, cluster }) =>
        createElement(WorkflowEventDetailsExecutionLink, {
          domain,
          cluster,
          workflowId: value?.workflowId,
          runId: value?.runId,
        }),
    },
    {
      name: 'RunIds as link',
      matcher: (name) =>
        new RegExp(
          '(firstExecutionRunId|originalExecutionRunId|newExecutionRunId|continuedExecutionRunId)$'
        ).test(name),
      icon: MdLabelImportantOutline,
      renderValue: ({ value, domain, cluster, workflowId }) =>
        createElement(WorkflowEventDetailsExecutionLink, {
          domain,
          cluster,
          workflowId: workflowId,
          runId: value,
        }),
    },
    {
      name: 'Strings as is',
      matcher: (name) => typeof name === 'string',
      icon: null,
      renderValue: ({ value }) => value,
    },
  ];

export default workflowHistoryEventSummaryParsersConfig;
