import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

export default function getScheduleRunsQuery(
  scheduleId: string,
  search = '',
  isPartialMatchingEnabled = false
): string {
  const scheduleQuery = `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}"`;
  if (!search) return scheduleQuery;

  const comparator = isPartialMatchingEnabled ? 'LIKE' : '=';
  const escapedSearch = escapeVisibilityQueryValue(search);
  return `${scheduleQuery} AND (RunID ${comparator} "${escapedSearch}" OR WorkflowID ${comparator} "${escapedSearch}" OR CadenceScheduleBackfillID ${comparator} "${escapedSearch}")`;
}
