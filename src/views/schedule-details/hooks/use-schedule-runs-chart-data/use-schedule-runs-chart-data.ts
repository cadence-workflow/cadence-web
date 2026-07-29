'use client';
import { useMemo } from 'react';

import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import describeScheduleToNextExecutionMs from './helpers/describe-schedule-to-next-execution';
import filterChartPointsBeforeNextExecution from './helpers/filter-chart-points-before-next-execution';
import workflowsForScheduleToChartSeriesRuns from './helpers/workflows-for-schedule-to-chart-series-runs';
import {
  CHART_DESCRIBE_REFRESH_INTERVAL_MS,
  CHART_WORKFLOWS_PAGE_SIZE,
  CHART_WORKFLOWS_REFRESH_INTERVAL_MS,
} from './use-schedule-runs-chart-data.constants';
import {
  type UseScheduleRunsChartDataParams,
  type UseScheduleRunsChartDataResult,
} from './use-schedule-runs-chart-data.types';

export default function useScheduleRunsChartData({
  domain,
  cluster,
  scheduleId,
  nowMs: _nowMs,
}: UseScheduleRunsChartDataParams): UseScheduleRunsChartDataResult {
  const describeQuery = useDescribeSchedule({
    domain,
    cluster,
    scheduleId,
    runningScheduleRefetchIntervalMs: CHART_DESCRIBE_REFRESH_INTERVAL_MS,
  });
  const workflowsQuery = useListWorkflowsForSchedule({
    domain,
    cluster,
    scheduleId,
    pageSize: CHART_WORKFLOWS_PAGE_SIZE,
    refetchIntervalMs: CHART_WORKFLOWS_REFRESH_INTERVAL_MS,
    runsRevision: describeQuery.data?.info?.totalRuns,
  });

  const runs = useMemo(
    () => workflowsForScheduleToChartSeriesRuns(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const nextExecutionTimeMs = useMemo(
    () => describeScheduleToNextExecutionMs(describeQuery.data),
    [describeQuery.data]
  );

  const data = useMemo(
    () => ({
      runs: filterChartPointsBeforeNextExecution(runs, nextExecutionTimeMs),
      // ponytail: skipped/missed executions are inferred from the cron
      // schedule in a follow-up slice; until then the chart simply shows no
      // skipped markers.
      skippedExecutions: [],
      nextExecutionTimeMs,
    }),
    [nextExecutionTimeMs, runs]
  );

  return {
    data,
    isLoading: describeQuery.isLoading || workflowsQuery.isLoading,
  };
}
