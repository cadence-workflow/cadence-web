import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

import {
  SCHEDULE_WORKFLOWS_VISIBILITY_QUERY_ATTRIBUTE,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from './use-list-workflows-for-schedule.constants';

export default function buildScheduleWorkflowsVisibilityQuery(
  scheduleId: string
): string {
  return `${SCHEDULE_WORKFLOWS_VISIBILITY_QUERY_ATTRIBUTE} = "${escapeVisibilityQueryValue(scheduleId)}" ORDER BY ${SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN} ${SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER}`;
}
