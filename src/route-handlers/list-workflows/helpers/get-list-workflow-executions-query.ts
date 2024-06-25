import { type SortOrder } from '@/utils/sort-by';
import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export default function getListWorkflowExecutionsQuery({
  search,
  workflowStatus,
  sortColumn,
  sortOrder,
  timeRangeStart,
  timeRangeEnd,
}: {
  search?: string;
  workflowStatus?: WorkflowStatus;
  sortColumn?: string;
  sortOrder?: SortOrder;
  timeRangeStart?: string;
  timeRangeEnd?: string;
}) {
  const searchQueries: Array<string> = [];
  if (search) {
    searchQueries.push(
      `(WorkflowType = "${search}" OR WorkflowID = "${search}" OR RunID = "${search}")`
    );
  }

  if (workflowStatus) {
    if (workflowStatus === WORKFLOW_STATUSES.running) {
      searchQueries.push('CloseTime = missing');
    } else {
      searchQueries.push(
        // Query CloseStatus is 0-indexed (and excludes INVALID)
        // https://cadenceworkflow.io/docs/concepts/search-workflows/#query-capabilities
        `CloseStatus = ${Object.values(WORKFLOW_STATUSES).indexOf(workflowStatus) - 1}`
      );
    }
  }

  if (timeRangeStart) {
    searchQueries.push(`StartTime > "${timeRangeStart}"`);
  }

  if (timeRangeEnd) {
    searchQueries.push(`StartTime <= "${timeRangeEnd}"`);
  }

  return (
    (searchQueries.length > 0 ? `${searchQueries.join(' AND ')} ` : '') +
    `ORDER BY ${sortColumn ?? 'StartTime'} ${sortOrder ?? 'DESC'}`
  );
}
