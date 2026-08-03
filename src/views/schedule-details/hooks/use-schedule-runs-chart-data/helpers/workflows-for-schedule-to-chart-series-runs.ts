import { type InfiniteData } from '@tanstack/react-query';

import {
  type ListWorkflowsResponse,
  type WorkflowListItem,
} from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

const SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE = 'CadenceScheduleBackfillID';

export default function workflowsForScheduleToChartSeriesRuns(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): ChartSeriesRun[] {
  const seenRunIds = new Set<string>();

  return (data?.pages.flatMap((page) => page.workflows ?? []) ?? []).reduce<
    ChartSeriesRun[]
  >((runs, workflow) => {
    if (seenRunIds.has(workflow.runID)) {
      return runs;
    }

    const scheduledTimeMs = resolveWorkflowScheduledTimeMs(workflow);
    if (scheduledTimeMs == null) {
      return runs;
    }

    const backfillId = getSearchAttributeValue(
      workflow,
      SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE
    );

    seenRunIds.add(workflow.runID);
    runs.push({
      runId: workflow.runID,
      status: workflow.status,
      scheduledTimeMs,
      isBackfill: typeof backfillId === 'string' && backfillId.length > 0,
    });

    return runs;
  }, []);
}

/** Prefers the schedule's own CadenceScheduleTime search attribute, falling back to the workflow's actual start time when it is missing or unparsable. */
function resolveWorkflowScheduledTimeMs(
  workflow: WorkflowListItem
): number | null {
  const scheduleTime = getSearchAttributeValue(
    workflow,
    SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
  );
  const parsedScheduleTimeMs =
    typeof scheduleTime === 'string' ? Date.parse(scheduleTime) : NaN;

  if (!Number.isNaN(parsedScheduleTimeMs)) {
    return parsedScheduleTimeMs;
  }

  return Number.isFinite(workflow.startTime) ? workflow.startTime : null;
}
