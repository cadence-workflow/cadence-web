import { type InfiniteData } from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE } from '@/views/schedule-details/hooks/use-schedule-runs-chart-data/use-schedule-runs-chart-data.constants';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/schedule-details.constants';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

export default function workflowsForScheduleToChartSeriesRuns(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): ChartSeriesRun[] {
  // Keyed by runID: when several runs tie on CadenceScheduleTime, paginated
  // fetches can return the same run on more than one page as the tie order
  // shifts, which would otherwise double-count it into a false "grouped"
  // marker.
  const runsByRunId = new Map<string, ChartSeriesRun>();
  const workflows = data?.pages.flatMap((page) => page.workflows ?? []) ?? [];

  for (const workflow of workflows) {
    const scheduleTime = getSearchAttributeValue(
      workflow,
      SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
    );
    if (typeof scheduleTime !== 'string') {
      continue;
    }

    const scheduledTimeMs = Date.parse(scheduleTime);
    if (!Number.isFinite(scheduledTimeMs)) {
      continue;
    }

    const backfillId = getSearchAttributeValue(
      workflow,
      SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE
    );
    const normalizedBackfillId =
      typeof backfillId === 'string' && backfillId.length > 0
        ? backfillId
        : undefined;

    runsByRunId.set(workflow.runID, {
      workflowId: workflow.workflowID,
      runId: workflow.runID,
      status: workflow.status,
      scheduledTimeMs,
      startedTimeMs: Number.isFinite(workflow.startTime)
        ? workflow.startTime
        : null,
      endedTimeMs:
        workflow.closeTime != null && Number.isFinite(workflow.closeTime)
          ? workflow.closeTime
          : null,
      isBackfill: normalizedBackfillId != null,
      backfillId: normalizedBackfillId,
    });
  }

  return Array.from(runsByRunId.values());
}
