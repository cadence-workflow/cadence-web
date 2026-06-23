import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';

export default function isMissedScheduleWorkflowExecution(
  workflow: WorkflowListItem
): boolean {
  return (
    workflow.historyLength === 0 &&
    workflow.closeTime == null &&
    workflow.status === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
  );
}
