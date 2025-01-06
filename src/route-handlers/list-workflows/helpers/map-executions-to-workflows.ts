import type { WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import type { DomainWorkflow } from '@/views/domain-page/domain-page.types';

export default function mapExecutionsToWorkflows(
  executions: Array<WorkflowExecutionInfo>
): Array<DomainWorkflow> {
  return executions.reduce((acc: Array<DomainWorkflow>, execution) => {
    if (
      !execution.workflowExecution ||
      !execution.type ||
      !execution.startTime
    ) {
      return acc;
    }

    acc.push({
      workflowID: execution.workflowExecution.workflowId,
      runID: execution.workflowExecution.runId,
      workflowName: execution.type.name,
      status: execution.closeStatus,
      startTime: parseGrpcTimestamp(execution.startTime),
      closeTime: execution.closeTime
        ? parseGrpcTimestamp(execution.closeTime)
        : undefined,
    });

    return acc;
  }, []);
}
