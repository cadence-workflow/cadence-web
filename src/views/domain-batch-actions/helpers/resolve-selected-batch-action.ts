import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

/**
 * Resolves which batch action the detail panel should show. A URL selection is
 * the (runId, workflowId) pair carried together by batchActionId +
 * batchActionWorkflowId:
 * - both ids present → that action;
 * - exactly one id present → invalid selection, resolves to nothing so the view
 *   can show an error instead of the wrong action;
 * - neither present → default to the first loaded action.
 */
export default function resolveSelectedBatchAction({
  batchActions,
  batchActionId,
  batchActionWorkflowId,
}: {
  batchActions: BatchActionListItem[];
  batchActionId: string | undefined;
  batchActionWorkflowId: string | undefined;
}): { selectedActionId: string | null; selectedWorkflowId: string | null } {
  if (batchActionId || batchActionWorkflowId) {
    return batchActionId && batchActionWorkflowId
      ? {
          selectedActionId: batchActionId,
          selectedWorkflowId: batchActionWorkflowId,
        }
      : { selectedActionId: null, selectedWorkflowId: null };
  }

  const firstAction = batchActions[0];
  return {
    selectedActionId: firstAction?.runId ?? null,
    selectedWorkflowId: firstAction?.workflowId ?? null,
  };
}
