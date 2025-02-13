import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import type { Props as WorkflowStatusTagProps } from '@/views/shared/workflow-status-tag/workflow-status-tag-icon/workflow-status-tag-icon.types';

import getWorkflowIsCompleted from './get-workflow-is-completed';

//TODO: @assem.hafez add type form response to lastEvent
const getWorkflowStatusTagProps = (
  lastEvent?: Pick<
    HistoryEvent,
    'attributes' | 'workflowExecutionContinuedAsNewEventAttributes'
  > | null,
  workflowInfo?: { cluster: string; workflowId: string; domain: string },
  isArchived?: boolean
): Pick<WorkflowStatusTagProps, 'status' | 'link' | 'isArchived'> => {
  if (isArchived)
    return {
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      isArchived: true,
    };

  if (!lastEvent || !lastEvent.attributes)
    return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID' };

  const isCompleted = getWorkflowIsCompleted(lastEvent.attributes);
  if (!isCompleted)
    return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID' };

  switch (lastEvent?.attributes) {
    case 'workflowExecutionFailedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' };
    case 'workflowExecutionCanceledEventAttributes':
    case 'workflowExecutionCancelRequestedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED' };
    case 'workflowExecutionCompletedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED' };
    case 'workflowExecutionTerminatedEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED' };
    case 'workflowExecutionContinuedAsNewEventAttributes':
      const { workflowId, domain, cluster } = workflowInfo || {};
      const runId =
        lastEvent.workflowExecutionContinuedAsNewEventAttributes
          ?.newExecutionRunId;
      return {
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
        link:
          domain && runId && workflowId && cluster
            ? `/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`
            : undefined,
      };
    case 'workflowExecutionTimedOutEventAttributes':
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT' };
    default:
      return { status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID' };
  }
};

export default getWorkflowStatusTagProps;
