import { type InfiniteData } from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/schedule-details.constants';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

export default function getOldestLoadedScheduleTimeMs(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): number | null {
  const scheduledTimesMs = (
    data?.pages.flatMap((page) => page.workflows ?? []) ?? []
  )
    .map((workflow) => {
      const scheduleTime = getSearchAttributeValue(
        workflow,
        SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
      );
      if (typeof scheduleTime !== 'string') {
        return null;
      }

      const scheduledTimeMs = Date.parse(scheduleTime);
      return Number.isFinite(scheduledTimeMs) ? scheduledTimeMs : null;
    })
    .filter((timeMs): timeMs is number => timeMs != null);

  if (scheduledTimesMs.length === 0) {
    return null;
  }

  return Math.min(...scheduledTimesMs);
}
