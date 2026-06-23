import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

import parseScheduleSearchAttributeTimeMs from './parse-schedule-search-attribute-time-ms';

export default function getScheduleWorkflowScheduledTimeMs(
  workflow: WorkflowListItem
): number | null {
  const scheduleTime = getSearchAttributeValue(
    workflow,
    SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
  );
  const scheduleTimeMs = parseScheduleSearchAttributeTimeMs(scheduleTime);

  if (scheduleTimeMs != null) {
    return scheduleTimeMs;
  }

  if (Number.isFinite(workflow.startTime)) {
    return workflow.startTime;
  }

  return null;
}
