import { type InfiniteData } from '@tanstack/react-query';

import {
  type ListWorkflowsResponse,
  type WorkflowListItem,
} from '@/route-handlers/list-workflows/list-workflows.types';

import { type ScheduleMetricsChartSeriesData } from '../schedule-detail-metrics-chart-series.types';

import getScheduleWorkflowScheduledTimeMs from './get-schedule-workflow-scheduled-time-ms';
import isMissedScheduleWorkflowExecution from './is-missed-schedule-workflow-execution';

export type WorkflowsForScheduleChartPoints = Pick<
  ScheduleMetricsChartSeriesData,
  'successfulRuns' | 'missedExecutions'
>;

export default function workflowsForScheduleToChartPoints(
  data: InfiniteData<ListWorkflowsResponse> | undefined
): WorkflowsForScheduleChartPoints {
  const workflows = flattenScheduleWorkflowPages(data);

  return workflows.reduce<WorkflowsForScheduleChartPoints>(
    (chartPoints, workflow) => {
      const scheduledTimeMs = getScheduleWorkflowScheduledTimeMs(workflow);

      if (scheduledTimeMs == null) {
        return chartPoints;
      }

      const point = { scheduledTimeMs };

      if (isMissedScheduleWorkflowExecution(workflow)) {
        chartPoints.missedExecutions.push(point);
      } else {
        chartPoints.successfulRuns.push(point);
      }

      return chartPoints;
    },
    { successfulRuns: [], missedExecutions: [] }
  );
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
