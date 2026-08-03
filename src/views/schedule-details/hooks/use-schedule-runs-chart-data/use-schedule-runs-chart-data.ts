'use client';
import { useMemo } from 'react';

import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useDomainDescription from '@/views/shared/hooks/use-domain-description/use-domain-description';

import getOldestLoadedScheduleTimeMs from './helpers/get-oldest-loaded-schedule-time-ms';
import getScheduleNextExecutionTimeMs from './helpers/get-schedule-next-execution-time-ms';
import getScheduleTimelineBounds from './helpers/get-schedule-timeline-bounds';
import getSkippedScheduleExecutions from './helpers/get-skipped-schedule-executions';
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
  nowMs,
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
  const domainQuery = useDomainDescription({ domain, cluster });

  // Rounded to the minute so a per-second `nowMs` tick does not re-walk the
  // cron timeline on every render.
  const cronEvaluationTimeMs = Math.floor(nowMs / 60_000) * 60_000;

  const runs = useMemo(
    () => workflowsForScheduleToChartSeriesRuns(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const nextExecutionTimeMs = useMemo(
    () => getScheduleNextExecutionTimeMs(describeQuery.data),
    [describeQuery.data]
  );
  const oldestLoadedScheduleTimeMs = useMemo(
    () => getOldestLoadedScheduleTimeMs(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const retentionSeconds = formatDurationToSeconds(
    domainQuery.data?.workflowExecutionRetentionPeriod
  );
  const timelineBounds = useMemo(
    () =>
      getScheduleTimelineBounds({
        describeSchedule: describeQuery.data,
        retentionSeconds,
        nowMs: cronEvaluationTimeMs,
      }),
    [cronEvaluationTimeMs, describeQuery.data, retentionSeconds]
  );
  const cronExpression = describeQuery.data?.spec?.cronExpression ?? '';
  const skippedExecutions = useMemo(
    () =>
      getSkippedScheduleExecutions({
        cronExpression,
        inferenceStartMs: timelineBounds.inferenceStartMs,
        scheduleEndMs: timelineBounds.scheduleEndMs,
        oldestLoadedScheduleTimeMs,
        hasNextPage: workflowsQuery.hasNextPage ?? false,
        nowMs: cronEvaluationTimeMs,
        nextExecutionTimeMs,
        actualTimesMs: runs.map(({ scheduledTimeMs }) => scheduledTimeMs),
      }),
    [
      cronEvaluationTimeMs,
      cronExpression,
      nextExecutionTimeMs,
      oldestLoadedScheduleTimeMs,
      runs,
      timelineBounds.inferenceStartMs,
      timelineBounds.scheduleEndMs,
      workflowsQuery.hasNextPage,
    ]
  );

  const data = useMemo(() => {
    const isBeforeNextExecution = ({
      scheduledTimeMs,
    }: {
      scheduledTimeMs: number;
    }) => nextExecutionTimeMs == null || scheduledTimeMs < nextExecutionTimeMs;

    return {
      runs: runs.filter(isBeforeNextExecution),
      skippedExecutions: skippedExecutions.filter(isBeforeNextExecution),
      nextExecutionTimeMs,
    };
  }, [nextExecutionTimeMs, runs, skippedExecutions]);

  return {
    data,
    isLoading:
      describeQuery.isLoading ||
      domainQuery.isLoading ||
      workflowsQuery.isLoading,
  };
}
