import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { BATCH_ACTION_STATUS_BY_CLOSE_STATUS } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export default function getBatchActionDetailFromWorkflow(
  response: DescribeWorkflowExecutionResponse
): BatchAction | undefined {
  const info = response.workflowExecutionInfo;
  if (!info?.workflowExecution?.workflowId) {
    return undefined;
  }

  return {
    id: info.workflowExecution.workflowId,
    status: BATCH_ACTION_STATUS_BY_CLOSE_STATUS[info.closeStatus],
    startTime: info.startTime ? parseGrpcTimestamp(info.startTime) : undefined,
    endTime: info.closeTime ? parseGrpcTimestamp(info.closeTime) : undefined,
  };
}
