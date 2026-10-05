import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { BATCH_ACTION_STATUS_BY_CLOSE_STATUS } from '../list-batch-actions.constants';
import { type BatchActionListItem } from '../list-batch-actions.types';

export default function getBatchActionFromWorkflow(
  execution: WorkflowExecutionInfo
): BatchActionListItem | undefined {
  if (
    !execution.workflowExecution?.workflowId ||
    !execution.workflowExecution?.runId ||
    !execution.startTime
  ) {
    return undefined;
  }

  const closeStatus =
    execution.closeStatus ?? 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  return {
    workflowId: execution.workflowExecution.workflowId,
    runId: execution.workflowExecution.runId,
    status: BATCH_ACTION_STATUS_BY_CLOSE_STATUS[closeStatus],
    startTime: parseGrpcTimestamp(execution.startTime),
  };
}
