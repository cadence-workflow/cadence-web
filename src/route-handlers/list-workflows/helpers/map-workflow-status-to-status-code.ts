import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

// TODO @adhitya.mamallan - Use the GRPC enum here when it is ready
export default function mapWorkflowStatusToStatusCode(
  status: WorkflowStatus
): number {
  switch (status) {
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED':
      return 1;
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED':
      return 2;
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED':
      return 3;
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED':
      return 4;
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW':
      return 5;
    case 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT':
      return 6;
    default:
      return 0;
  }
}
