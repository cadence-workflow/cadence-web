import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import WorkflowHistoryEventDetailsTaskListLink from '@/views/shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';
import getWorkflowStatusTagProps from '@/views/workflow-page/helpers/get-workflow-status-tag-props';

import WorkflowEventDetailsExecutionLink from '../../shared/workflow-event-details-execution-link/workflow-event-details-execution-link';
import getActiveClusterSelectionPolicy from '../workflow-summary-details/helpers/get-active-cluster-selection-policy';
import { ACTIVE_CLUSTER_SELECTION_STRATEGY_LABEL_MAP } from '../workflow-summary-details/workflow-summary-details.constants';
import { type WorkflowSummaryDetailsConfig } from '../workflow-summary-details/workflow-summary-details.types';

const workflowSummaryDetailsConfig: WorkflowSummaryDetailsConfig[] = [
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
  {
    key: 'activeClusterSelectionStrategy',
    getLabel: () => 'Cluster Strategy',
    valueComponent: (args) => {
      const policy = getActiveClusterSelectionPolicy(args);

      return policy
        ? ACTIVE_CLUSTER_SELECTION_STRATEGY_LABEL_MAP[policy.strategy]
        : null;
    },
    hide: (args) => getActiveClusterSelectionPolicy(args) === null,
  },
  {
    key: 'stickyRegion',
    getLabel: () => 'Sticky Region',
    valueComponent: (args) => {
      const policy = getActiveClusterSelectionPolicy(args);

      if (
        policy?.strategy !== 'ACTIVE_CLUSTER_SELECTION_STRATEGY_REGION_STICKY'
      )
        return null;

      return policy.activeClusterStickyRegionConfig?.stickyRegion;
    },
    hide: (args) =>
      getActiveClusterSelectionPolicy(args)?.strategy !==
      'ACTIVE_CLUSTER_SELECTION_STRATEGY_REGION_STICKY',
  },
  {
    key: 'externalEntityType',
    getLabel: () => 'Entity Type',
    valueComponent: (args) => {
      const policy = getActiveClusterSelectionPolicy(args);

      if (
        policy?.strategy !== 'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY'
      )
        return null;

      return policy.activeClusterExternalEntityConfig?.externalEntityType;
    },
    hide: (args) =>
      getActiveClusterSelectionPolicy(args)?.strategy !==
      'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY',
  },
  {
    key: 'externalEntityKey',
    getLabel: () => 'Entity Key',
    valueComponent: (args) => {
      const policy = getActiveClusterSelectionPolicy(args);

      if (
        policy?.strategy !== 'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY'
      )
        return null;

      return policy.activeClusterExternalEntityConfig?.externalEntityKey;
    },
    hide: (args) =>
      getActiveClusterSelectionPolicy(args)?.strategy !==
      'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY',
  },
];

export default workflowSummaryDetailsConfig;
