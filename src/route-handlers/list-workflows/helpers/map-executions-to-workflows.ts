import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import type { DomainWorkflow } from '@/views/domain-page/domain-page.types';

// TODO @adhitya.mamallan - use GRPC types here when they are ready
export default function mapExecutionsToWorkflows(
  executions: Array<any>
): Array<DomainWorkflow> {
  return executions
    .filter(
      (execution) =>
        execution.workflowExecution?.runId &&
        execution.workflowExecution?.workflowId &&
        execution.type?.name &&
        execution.startTime
    )
    .map((execution): DomainWorkflow => {
      const workflowExecutionCloseTime = execution.closeTime
        ? parseGrpcTimestamp(execution.closeTime)
        : undefined;

      return {
        workflowID: execution.workflowExecution.workflowId,
        runID: execution.workflowExecution?.runId,
        workflowName: execution.type?.name,
        status: Boolean(workflowExecutionCloseTime)
          ? execution.closeStatus
          : 'WORKFLOW_EXECUTION_STATUS_RUNNING',
        startTime: parseGrpcTimestamp(execution.startTime),
        closeTime: workflowExecutionCloseTime,
      };
    });
}
