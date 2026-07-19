import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

export default function getScheduleRunsQuery(scheduleId: string): string {
  return `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}"`;
}
