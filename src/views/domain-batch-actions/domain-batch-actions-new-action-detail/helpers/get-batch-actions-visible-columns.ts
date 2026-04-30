import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

import { BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS } from '../domain-batch-actions-new-action-detail.constants';

export default function getBatchActionsVisibleColumns(
  availableColumns: Array<WorkflowsListColumn>
): Array<WorkflowsListColumn> {
  const columnById = new Map(availableColumns.map((col) => [col.id, col]));
  return BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS.map((id) =>
    columnById.get(id)
  ).filter((col): col is WorkflowsListColumn => col != null);
}
