import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

import { SCHEDULE_WORKFLOWS_VISIBILITY_QUERY_ATTRIBUTE } from './use-list-workflows-for-schedule.constants';

export default function buildScheduleWorkflowsVisibilityQuery(
  scheduleId: string
): string {
  return `${SCHEDULE_WORKFLOWS_VISIBILITY_QUERY_ATTRIBUTE} = "${escapeVisibilityQueryValue(scheduleId)}"`;
}
