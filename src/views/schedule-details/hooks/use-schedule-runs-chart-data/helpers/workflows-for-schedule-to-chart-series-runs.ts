import { type InfiniteData } from '@tanstack/react-query';

import {
  type ListWorkflowsResponse,
  type WorkflowListItem,
} from '@/route-handlers/list-workflows/list-workflows.types';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

import getScheduleWorkflowScheduledTimeMs from './get-schedule-workflow-scheduled-time-ms';
import workflowListItemToChartSeriesRun from './workflow-list-item-to-chart-series-run';

export function flattenScheduleWorkflowPages(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): WorkflowListItem[] {
  return data?.pages.flatMap((page) => page.workflows ?? []) ?? [];
}

export default function workflowsForScheduleToChartSeriesRuns(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): ChartSeriesRun[] {
  const seenRunIds = new Set<string>();

  return flattenScheduleWorkflowPages(data).reduce<ChartSeriesRun[]>(
    (runs, workflow) => {
      if (seenRunIds.has(workflow.runID)) {
        return runs;
      }

      const run = workflowListItemToChartSeriesRun(workflow);

      if (run == null) {
        return runs;
      }

      seenRunIds.add(run.runId);
      runs.push(run);

      return runs;
    },
    []
  );
}

export function getOldestLoadedScheduleTimeMs(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): number | null {
  const scheduledTimesMs = flattenScheduleWorkflowPages(data)
    .map((workflow) => getScheduleWorkflowScheduledTimeMs(workflow))
    .filter((timeMs): timeMs is number => timeMs != null);

  if (scheduledTimesMs.length === 0) {
    return null;
  }

  return Math.min(...scheduledTimesMs);
}
