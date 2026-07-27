import { type InfiniteData } from '@tanstack/react-query';

import {
  type ListWorkflowsResponse,
  type WorkflowListItem,
} from '@/route-handlers/list-workflows/list-workflows.types';

import {
  type ScheduleMetricsChartExecutionPoint,
  type ScheduleMetricsChartRun,
} from '../schedule-detail-metrics-chart-series.types';

import getScheduleWorkflowScheduledTimeMs from './get-schedule-workflow-scheduled-time-ms';
import workflowListItemToChartRun from './workflow-list-item-to-chart-run';

export type WorkflowsForScheduleChartPoints = {
  successfulRuns: ScheduleMetricsChartExecutionPoint[];
};

export default function workflowsForScheduleToChartPoints(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): WorkflowsForScheduleChartPoints {
  const workflows = flattenScheduleWorkflowPages(data);
  const seenRunIds = new Set<string>();

  return workflows.reduce<WorkflowsForScheduleChartPoints>(
    (chartPoints, workflow) => {
      if (seenRunIds.has(workflow.runID)) {
        return chartPoints;
      }

      const run = workflowListItemToChartRun(workflow);

      if (run == null) {
        return chartPoints;
      }

      seenRunIds.add(run.runId);
      appendRunToExecutionPoints(chartPoints.successfulRuns, run);

      return chartPoints;
    },
    { successfulRuns: [] }
  );
}

function appendRunToExecutionPoints(
  points: ScheduleMetricsChartExecutionPoint[],
  run: ScheduleMetricsChartRun
) {
  const existingPoint = points.find(
    (point) => point.scheduledTimeMs === run.scheduledTimeMs
  );

  if (existingPoint) {
    existingPoint.runs.push(run);
    return;
  }

  points.push({ scheduledTimeMs: run.scheduledTimeMs, runs: [run] });
}

export function flattenScheduleWorkflowPages(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): WorkflowListItem[] {
  return data?.pages.flatMap((page) => page.workflows ?? []) ?? [];
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
