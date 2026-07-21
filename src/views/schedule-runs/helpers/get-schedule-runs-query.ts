import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';
import { WORKFLOW_STATUS_QUERIES } from '@/utils/visibility/get-visibility-query.constants';

import { type ScheduleRunsQueryFilters } from '../schedule-runs.types';

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

  if (filters.statuses?.length) {
    clauses.push(
      `(${filters.statuses
        .map((status) => WORKFLOW_STATUS_QUERIES[status])
        .join(' OR ')})`
    );
  }

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
