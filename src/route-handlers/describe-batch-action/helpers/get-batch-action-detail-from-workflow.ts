import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import {
  BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE,
  BATCH_ACTION_STATUS_BY_CLOSE_STATUS,
  BATCH_ACTION_WORKFLOW_TYPE,
} from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import formatPayload from '@/utils/data-formatters/format-payload';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export default function getBatchActionDetailFromWorkflow(
  response: DescribeWorkflowExecutionResponse,
  expectedDomain: string
): BatchAction | undefined {
  const info = response.workflowExecutionInfo;
  // Reject anything that isn't a batch action for this domain — a deep link to a
  // random workflow's runId, or to another domain's batch action — so the handler
  // surfaces a "not found".
  const customDomain = formatPayload(
    info?.searchAttributes?.indexedFields?.[
      BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE
    ]
  );
  if (
    !info?.workflowExecution?.runId ||
    info.type?.name !== BATCH_ACTION_WORKFLOW_TYPE ||
    customDomain !== expectedDomain
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
