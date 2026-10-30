import { DEFAULT_WORKFLOWS_LIST_COLUMNS } from '@/views/shared/workflows-list/workflows-list.constants';
import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

export default function getMarkdocWorkflowsListColumns(
  availableColumns: Array<WorkflowsListColumn>,
  columnIds?: string
): Array<WorkflowsListColumn> {
  const requestedIds = columnIds
    ? columnIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
  const ids = requestedIds.length
    ? requestedIds
    : [...DEFAULT_WORKFLOWS_LIST_COLUMNS];

  const columnById = new Map(availableColumns.map((col) => [col.id, col]));
  return ids
    .map((id) => columnById.get(id))
    .filter((col): col is WorkflowsListColumn => col !== undefined);
}
