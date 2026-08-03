'use client';
import { useMemo } from 'react';

import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

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

  const data = useMemo(() => {
    const runs = workflowsForScheduleToChartSeriesRuns(workflowsQuery.data);

    const describe = describeQuery.data;
    let nextExecutionTimeMs: number | null = null;
    if (!describe?.state?.paused) {
      const ms = formatTimestampToDatetime(describe?.info?.nextRunTime)?.valueOf();
      if (typeof ms === 'number' && Number.isFinite(ms)) nextExecutionTimeMs = ms;
    }

    // Next run and the run list come from two independently polled APIs, so
    // drop points at or after the next run until describe catches up.
    const filteredRuns =
      nextExecutionTimeMs == null
        ? runs
        : runs.filter(
            ({ scheduledTimeMs }) => scheduledTimeMs < nextExecutionTimeMs
          );

    return {
      runs: filteredRuns,
      // skipped/missed executions are inferred from the cron
      // schedule in a follow-up slice; until then the chart simply shows no
      // skipped markers.
      skippedExecutions: [],
      nextExecutionTimeMs,
    };
  }, [describeQuery.data, workflowsQuery.data]);

  return {
    data,
    isLoading: describeQuery.isLoading || workflowsQuery.isLoading,
  };
}
