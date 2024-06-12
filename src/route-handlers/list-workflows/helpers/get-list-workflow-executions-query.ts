import { type SortOrder } from '@/utils/sort-by';
import type { WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import mapWorkflowStatusToStatusCode from './map-workflow-status-to-status-code';

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
    if (workflowStatus === 'WORKFLOW_EXECUTION_STATUS_RUNNING') {
      searchQueries.push('CloseTime = missing');
    } else {
      searchQueries.push(
        `CloseStatus = ${mapWorkflowStatusToStatusCode(workflowStatus)}`
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
