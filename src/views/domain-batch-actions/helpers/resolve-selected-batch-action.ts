import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

/**
 * Resolves which batch action the detail panel should show, from the URL params
 * and the loaded list. The action is identified by its runId (the URL identity),
 * defaulting to the first loaded action. describe also needs the workflowId:
 * it comes from the URL (deep links carry it), or from the matching list item.
 */
export default function resolveSelectedBatchAction({
  batchActions,
  batchActionId,
  batchActionWorkflowId,
  isDraftSelected,
}: {
  batchActions: BatchActionListItem[];
  batchActionId: string | undefined;
  batchActionWorkflowId: string | undefined;
  isDraftSelected: boolean;
}): { selectedActionId: string | null; selectedWorkflowId: string | null } {
  const firstActionId = batchActions[0]?.runId ?? null;
  const selectedActionId = isDraftSelected
    ? firstActionId
    : batchActionId || firstActionId;

  const selectedWorkflowId =
    batchActionWorkflowId ||
    batchActions.find((action) => action.runId === selectedActionId)
      ?.workflowId ||
    null;

  return { selectedActionId, selectedWorkflowId };
}
