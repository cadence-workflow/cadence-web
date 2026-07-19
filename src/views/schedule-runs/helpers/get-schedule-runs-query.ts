import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

export default function getScheduleRunsQuery(
  scheduleId: string,
  filters?: {
    timeRangeStart?: string;
    timeRangeEnd?: string;
  }
): string {
  const clauses = [
    `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}"`,
  ];
  if (filters?.timeRangeStart) {
    clauses.push(`CadenceScheduleTime > "${filters.timeRangeStart}"`);
  }
  if (filters?.timeRangeEnd) {
    clauses.push(`CadenceScheduleTime <= "${filters.timeRangeEnd}"`);
  }
  return clauses.join(' AND ');
}
