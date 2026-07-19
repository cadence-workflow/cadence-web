import { type SortOrder } from '@/utils/sort-by';
import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

export default function getScheduleRunsQuery(
  scheduleId: string,
  sortOrder: SortOrder = 'DESC'
): string {
  return `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}" ORDER BY CadenceScheduleTime ${sortOrder}`;
}
