import { type SortOrder } from '@/utils/sort-by';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { WORKFLOW_STATUS_QUERIES } from './get-visibility-query.constants';

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

  const workflowStatusQueries =
    workflowStatuses?.map((status) => WORKFLOW_STATUS_QUERIES[status]) ?? [];

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
