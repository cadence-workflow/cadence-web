import { type InfiniteData } from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE } from '@/views/schedule-details/hooks/use-schedule-runs-chart-data/use-schedule-runs-chart-data.constants';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/schedule-details.constants';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

import parseScheduleSearchAttributeTimeMs from './parse-schedule-search-attribute-time-ms';

export default function workflowsForScheduleToChartSeriesRuns(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): ChartSeriesRun[] {
  return (data?.pages.flatMap((page) => page.workflows ?? []) ?? []).reduce<
    ChartSeriesRun[]
  >((runs, workflow) => {
    const scheduledTimeMs = parseScheduleSearchAttributeTimeMs(
      getSearchAttributeValue(
        workflow,
        SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
      )
    );
    if (scheduledTimeMs == null) {
      return runs;
    }

    const backfillId = getSearchAttributeValue(
      workflow,
      SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE
    );

    runs.push({
      runId: workflow.runID,
      status: workflow.status,
      scheduledTimeMs,
      isBackfill: typeof backfillId === 'string' && backfillId.length > 0,
    });

    return runs;
  }, []);
}
