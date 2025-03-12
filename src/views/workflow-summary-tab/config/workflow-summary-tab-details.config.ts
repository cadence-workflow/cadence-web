import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import WorkflowHistoryEventDetailsTaskListLink from '@/views/shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';
import getWorkflowStatusTagProps from '@/views/workflow-page/helpers/get-workflow-status-tag-props';

import WorkflowEventDetailsExecutionLink from '../../shared/workflow-event-details-execution-link/workflow-event-details-execution-link';
import { type WorkflowSummaryTabDetailsConfig } from '../workflow-summary-tab-details/workflow-summary-tab-details.types';

const workflowSummaryTabDetailsConfig: WorkflowSummaryTabDetailsConfig[] = [
  {
    key: 'status',
    getLabel: () => 'Status',
    valueComponent: ({ closeEvent, decodedPageUrlParams, workflowDetails }) =>
      createElement(
        WorkflowStatusTag,
        getWorkflowStatusTagProps(
          closeEvent,
          {
            cluster: decodedPageUrlParams.cluster,
            workflowId: decodedPageUrlParams.workflowId,
            domain: decodedPageUrlParams.domain,
          },
          workflowDetails.workflowExecutionInfo?.isArchived
        )
      ),
  },
  {
    key: 'continuedFrom',
    getLabel: () => 'Continued from',
    valueComponent: ({ firstEvent, decodedPageUrlParams }) => {
      const runId =
        firstEvent?.workflowExecutionStartedEventAttributes
          ?.continuedExecutionRunId;
      if (runId) {
        return createElement(WorkflowEventDetailsExecutionLink, {
          ...decodedPageUrlParams,
          runId,
        });
      }
    },
    hide: ({ firstEvent }) =>
      !firstEvent?.workflowExecutionStartedEventAttributes
        ?.continuedExecutionRunId,
  },
  {
    key: 'workflowId',
    getLabel: () => 'Workflow ID',
    valueComponent: ({ decodedPageUrlParams }) =>
      decodedPageUrlParams.workflowId,
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
    valueComponent: ({ decodedPageUrlParams }) => decodedPageUrlParams.runId,
  },
  {
    key: 'startTime',
    getLabel: () => 'Start at',
    valueComponent: ({ formattedFirstEvent }) =>
      createElement(
        'div',
        { suppressHydrationWarning: true },
        formattedFirstEvent?.timestamp
          ? formatDate(formattedFirstEvent.timestamp.valueOf())
          : '-'
      ),
  },
  {
    key: 'endTime',
    getLabel: () => 'End time',
    valueComponent: ({ formattedCloseEvent }) => {
      return createElement(
        'div',
        { suppressHydrationWarning: true },
        formattedCloseEvent?.timestamp
          ? formatDate(formattedCloseEvent.timestamp.valueOf())
          : '-'
      );
    },
    hide: ({ workflowDetails }) => {
      //hide it on archived events as the value is not available
      return Boolean(workflowDetails.workflowExecutionInfo?.isArchived);
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
    key: 'historyEventsCount',
    getLabel: () => 'History events',
    valueComponent: ({ workflowDetails }) =>
      workflowDetails.workflowExecutionInfo?.historyLength,
    hide: ({ workflowDetails }) => {
      //hide it on archived events as the value is not available
      return Boolean(workflowDetails.workflowExecutionInfo?.isArchived);
    },
  },
  {
    key: 'taskList',
    getLabel: () => 'Task list',
    valueComponent: ({ formattedFirstEvent, decodedPageUrlParams }) => {
      if (formattedFirstEvent && 'taskList' in formattedFirstEvent) {
        return createElement(WorkflowHistoryEventDetailsTaskListLink, {
          domain: decodedPageUrlParams.domain,
          cluster: decodedPageUrlParams.cluster,
          taskList: formattedFirstEvent?.taskList,
        });
      }
    },
  },
  {
    key: 'parentWorkflow',
    getLabel: () => 'Parent workflow',
    valueComponent: ({ decodedPageUrlParams, formattedFirstEvent }) => {
      const { runId, workflowId } =
        formattedFirstEvent?.parentWorkflowExecution || {};
      const domain = formattedFirstEvent?.parentWorkflowDomain;
      if (runId && workflowId && domain && decodedPageUrlParams.cluster) {
        return createElement(WorkflowEventDetailsExecutionLink, {
          domain,
          cluster: decodedPageUrlParams.cluster,
          workflowId,
          runId,
        });
      }
    },
    hide: ({ formattedFirstEvent, decodedPageUrlParams }) => {
      const { runId, workflowId } =
        formattedFirstEvent?.parentWorkflowExecution || {};
      const domain = formattedFirstEvent?.parentWorkflowDomain;
      return !(runId && workflowId && domain && decodedPageUrlParams.cluster);
    },
  },
];

export default workflowSummaryTabDetailsConfig;
