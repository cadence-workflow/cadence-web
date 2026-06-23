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
import isMissedScheduleWorkflowExecution from './is-missed-schedule-workflow-execution';
import workflowListItemToChartRun from './workflow-list-item-to-chart-run';

export type WorkflowsForScheduleChartPoints = {
  successfulRuns: ScheduleMetricsChartExecutionPoint[];
  missedExecutions: ScheduleMetricsChartExecutionPoint[];
};

export default function workflowsForScheduleToChartPoints(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): WorkflowsForScheduleChartPoints {
  const workflows = flattenScheduleWorkflowPages(data);

  return workflows.reduce<WorkflowsForScheduleChartPoints>(
    (chartPoints, workflow) => {
      const run = workflowListItemToChartRun(workflow);

      if (run == null) {
        return chartPoints;
      }

      const targetPoints = isMissedScheduleWorkflowExecution(workflow)
        ? chartPoints.missedExecutions
        : chartPoints.successfulRuns;

      appendRunToExecutionPoints(targetPoints, run);

      return chartPoints;
    },
    { successfulRuns: [], missedExecutions: [] }
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
