import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import {
  BATCH_ACTION_STATUS_BY_CLOSE_STATUS,
  BATCH_ACTION_WORKFLOW_TYPE,
} from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export default function getBatchActionDetailFromWorkflow(
  response: DescribeWorkflowExecutionResponse
): BatchAction | undefined {
  const info = response.workflowExecutionInfo;
  // Reject executions that aren't batch actions (e.g. a deep link to a random
  // workflow's runId), so the handler surfaces a "not found" instead of
  // rendering an unrelated workflow as a batch action.
  if (
    !info?.workflowExecution?.runId ||
    info.type?.name !== BATCH_ACTION_WORKFLOW_TYPE
  ) {
    return undefined;
  }

  return {
    runId: info.workflowExecution.runId,
    status: BATCH_ACTION_STATUS_BY_CLOSE_STATUS[info.closeStatus],
    startTime: info.startTime ? parseGrpcTimestamp(info.startTime) : undefined,
    endTime: info.closeTime ? parseGrpcTimestamp(info.closeTime) : undefined,
  };
}
