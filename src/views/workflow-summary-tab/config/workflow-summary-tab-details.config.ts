import { createElement } from 'react';

import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';
import getWorkflowIsCompleted from '@/views/workflow-page/helpers/get-workflow-is-completed';
import getWorkflowStatusTagProps from '@/views/workflow-page/helpers/get-workflow-status-tag-props';

import { type WorkflowSummaryTabDetailsConfig } from '../workflow-summary-tab-details/workflow-summary-tab-details.types';
import WorkflowSummaryTabDetailsExecutionLink from '../workflow-summary-tab-details-wf-execution-link/workflow-summary-tab-details-wf-execution-link';

const workflowSummaryTabDetailsConfig: WorkflowSummaryTabDetailsConfig[] = [
  {
    key: 'status',
    getLabel: () => 'Status',
    valueComponent: ({ lastEvent, params }) =>
      createElement(
        WorkflowStatusTag,
        getWorkflowStatusTagProps(lastEvent, {
          cluster: params.cluster,
          workflowId: params.workflowId,
          domain: params.domain,
        })
      ),
  },
  {
    key: 'lastEvent',
    getLabel: () => 'Last event',
    valueComponent: ({ lastEvent }) => {
      return createElement(
        'div',
        { suppressHydrationWarning: true },
        `${lastEvent?.eventType} (${new Date(lastEvent.timestamp).toLocaleString()})`
      );
    },
  },
  {
    key: 'continuedFrom',
    getLabel: () => 'Continued from',
    valueComponent: ({ firstEvent, params }) => {
      const runId =
        firstEvent?.workflowExecutionStartedEventAttributes
          ?.continuedExecutionRunId;
      return createElement(WorkflowSummaryTabDetailsExecutionLink, {
        ...params,
        runId,
      });
    },
    hide: ({ firstEvent }) =>
      !firstEvent?.workflowExecutionStartedEventAttributes
        ?.continuedExecutionRunId,
  },
  {
    key: 'workflowId',
    getLabel: () => 'Workflow ID',
    valueComponent: ({ params }) => params.workflowId,
  },
  {
    key: 'workflowType',
    getLabel: () => 'Workflow type',
    valueComponent: ({ firstEvent }) =>
      firstEvent?.workflowExecutionStartedEventAttributes?.workflowType?.name,
  },
  {
    key: 'runId',
    getLabel: () => 'Run ID',
    valueComponent: ({ params }) => params.runId,
  },
  {
    key: 'startTime',
    getLabel: () => 'Start at',
    valueComponent: ({ firstEvent }) =>
      createElement(
        'div',
        { suppressHydrationWarning: true },
        firstEvent?.timestamp
          ? new Date(firstEvent.timestamp).toLocaleString()
          : '-'
      ),
  },
  {
    key: 'endTime',
    getLabel: () => 'End time',
    valueComponent: ({ lastEvent }) => {
      const isCompletedEvent = getWorkflowIsCompleted(lastEvent.attributes);
      return createElement(
        'div',
        { suppressHydrationWarning: true },
        isCompletedEvent ? new Date(lastEvent.timestamp).toLocaleString() : '-'
      );
    },
  },
  {
    key: 'cronSchedule',
    getLabel: () => 'CRON schedule',
    valueComponent: ({ firstEvent }) =>
      firstEvent?.workflowExecutionStartedEventAttributes?.cronSchedule,
    hide: ({ firstEvent }) =>
      !firstEvent?.workflowExecutionStartedEventAttributes?.cronSchedule,
  },
  {
    key: 'parentWorkflow',
    getLabel: () => 'Parent workflow',
    valueComponent: ({ firstEvent, params }) => {
      const { runId, workflowId } =
        firstEvent?.workflowExecutionStartedEventAttributes
          ?.parentWorkflowExecution || {};
      return createElement(WorkflowSummaryTabDetailsExecutionLink, {
        domain:
          firstEvent?.workflowExecutionStartedEventAttributes
            ?.parentWorkflowDomain,
        cluster: params.cluster,
        workflowId,
        runId,
      });
    },
    hide: ({ firstEvent }) =>
      !firstEvent?.workflowExecutionStartedEventAttributes
        ?.parentWorkflowExecution?.runId,
  },
];

export default workflowSummaryTabDetailsConfig;
