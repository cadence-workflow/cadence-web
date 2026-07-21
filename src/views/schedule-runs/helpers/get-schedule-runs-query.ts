import { type SortOrder } from '@/utils/sort-by';
import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';
import getVisibilityQuery from '@/utils/visibility/get-visibility-query';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { type ScheduleRunsRunType } from '../schedule-runs.types';

export type ScheduleRunsQueryFilters = {
  search?: string;
  isPartialMatchingEnabled?: boolean;
  timeRangeStart?: string;
  timeRangeEnd?: string;
  statuses?: Array<WorkflowStatus>;
  runType?: ScheduleRunsRunType;
  sortOrder?: SortOrder;
};

export default function getScheduleRunsQuery(
  scheduleId: string,
  filters: ScheduleRunsQueryFilters = {}
): string {
  const clauses = [
    `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}"`,
  ];

  if (filters.search) {
    const comparator = filters.isPartialMatchingEnabled ? 'LIKE' : '=';
    const escapedSearch = escapeVisibilityQueryValue(filters.search);
    clauses.push(
      `(RunID ${comparator} "${escapedSearch}" OR WorkflowID ${comparator} "${escapedSearch}" OR CadenceScheduleBackfillID ${comparator} "${escapedSearch}")`
    );
  }

  const statusQuery = getVisibilityQuery({
    workflowStatuses: filters.statuses,
    timeColumn: 'StartTime',
    includeOrderBy: false,
  });
  if (statusQuery) clauses.push(statusQuery);

  if (filters.timeRangeStart) {
    clauses.push(`CadenceScheduleTime > "${filters.timeRangeStart}"`);
  }
  if (filters.timeRangeEnd) {
    clauses.push(`CadenceScheduleTime <= "${filters.timeRangeEnd}"`);
  }
  if (filters.runType !== undefined && filters.runType !== 'all') {
    clauses.push(
      `CadenceScheduleIsBackfill = "${filters.runType === 'backfill'}"`
    );
  }

  return `${clauses.join(' AND ')} ORDER BY CadenceScheduleTime ${filters.sortOrder ?? 'DESC'}`;
}
