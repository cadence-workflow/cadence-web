import { type SortOrder } from '@/utils/sort-by';
import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export default function getVisibilityQuery({
  search,
  workflowStatuses,
  sortColumn,
  sortOrder,
  timeColumn,
  timeRangeStart,
  timeRangeEnd,
  includeOrderBy = true,
  isPartialMatchingEnabled = false,
}: {
  search?: string;
  workflowStatuses?: Array<WorkflowStatus>;
  sortColumn?: string;
  sortOrder?: SortOrder;
  timeColumn: 'StartTime' | 'CloseTime';
  timeRangeStart?: string;
  timeRangeEnd?: string;
  includeOrderBy?: boolean;
  isPartialMatchingEnabled?: boolean;
}) {
  const searchQueries: Array<string> = [];
  if (search) {
    const comparator = isPartialMatchingEnabled ? 'LIKE' : '=';
    searchQueries.push(
      `(WorkflowType ${comparator} "${search}" OR WorkflowID ${comparator} "${search}" OR RunID ${comparator} "${search}")`
    );
  }

  const workflowStatusQueries: Array<string> = [];
  workflowStatuses?.forEach((status) => {
    if (status === WORKFLOW_STATUSES.running) {
      workflowStatusQueries.push('CloseTime = missing');
    } else {
      workflowStatusQueries.push(
        // Numerical query CloseStatus is 0-indexed (and excludes INVALID)
        // https://cadenceworkflow.io/docs/concepts/search-workflows/#query-capabilities
        `CloseStatus = ${Object.values(WORKFLOW_STATUSES).indexOf(status) - 1}`
      );
    }
  });

  if (workflowStatusQueries.length > 0) {
    searchQueries.push(`(${workflowStatusQueries.join(' OR ')})`);
  }

  if (timeRangeStart) {
    searchQueries.push(`${timeColumn} > "${timeRangeStart}"`);
  }

  if (timeRangeEnd) {
    searchQueries.push(`${timeColumn} <= "${timeRangeEnd}"`);
  }

  const filterClause =
    searchQueries.length > 0 ? searchQueries.join(' AND ') : '';
  const orderClause = includeOrderBy
    ? `ORDER BY ${sortColumn ?? 'StartTime'} ${sortOrder ?? 'DESC'}`
    : '';

  return [filterClause, orderClause].filter(Boolean).join(' ');
}
