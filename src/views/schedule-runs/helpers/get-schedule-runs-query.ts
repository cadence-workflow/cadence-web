import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';
import getVisibilityQuery from '@/utils/visibility/get-visibility-query';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export default function getScheduleRunsQuery(
  scheduleId: string,
  filters?: {
    timeRangeStart?: string;
    timeRangeEnd?: string;
    statuses?: Array<WorkflowStatus>;
  }
): string {
  const clauses = [
    `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}"`,
  ];
  const statusQuery = getVisibilityQuery({
    workflowStatuses: filters?.statuses,
    timeColumn: 'StartTime',
    includeOrderBy: false,
  });
  if (statusQuery) clauses.push(statusQuery);
  if (filters?.timeRangeStart) {
    clauses.push(`CadenceScheduleTime > "${filters.timeRangeStart}"`);
  }
  if (filters?.timeRangeEnd) {
    clauses.push(`CadenceScheduleTime <= "${filters.timeRangeEnd}"`);
  }
  return clauses.join(' AND ');
}
