import { type SortOrder } from '@/utils/sort-by';
import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { type TimeColumn } from '../list-workflows.types';

export default function getListWorkflowExecutionsQuery({
  search,
  workflowStatuses,
  sortColumn,
  sortOrder,
  timeColumn,
  timeRangeStart,
  timeRangeEnd,
}: {
  search?: string;
  workflowStatuses?: Array<WorkflowStatus>;
  sortColumn?: string;
  sortOrder?: SortOrder;
  timeColumn: TimeColumn;
  timeRangeStart?: string;
  timeRangeEnd?: string;
}) {
  const searchQueries: Array<string> = [];
  if (search) {
    searchQueries.push(
      `(WorkflowType = "${search}" OR WorkflowID = "${search}" OR RunID = "${search}")`
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

  return (
    (searchQueries.length > 0 ? `${searchQueries.join(' AND ')} ` : '') +
    `ORDER BY ${sortColumn ?? 'StartTime'} ${sortOrder ?? 'DESC'}`
  );
}
