'use client';
import { useMemo } from 'react';

import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useDomainDescription from '@/views/shared/hooks/use-domain-description/use-domain-description';

import {
  getDomainRetentionSeconds,
  getScheduleJitterMs,
  getScheduleTimelineBounds,
} from './helpers/get-schedule-cron-timeline';
import getSkippedScheduleExecutions from './helpers/get-skipped-schedule-executions';
import workflowsForScheduleToChartSeriesRuns, {
  getOldestLoadedScheduleTimeMs,
} from './helpers/workflows-for-schedule-to-chart-series-runs';
import {
  CHART_DESCRIBE_REFRESH_INTERVAL_MS,
  CHART_WORKFLOWS_PAGE_SIZE,
  CHART_WORKFLOWS_REFRESH_INTERVAL_MS,
} from './use-schedule-runs-chart-data.constants';
import {
  type UseScheduleRunsChartDataParams,
  type UseScheduleRunsChartDataResult,
} from './use-schedule-runs-chart-data.types';

function describeScheduleToNextExecutionMs(
  describeSchedule: ReturnType<typeof useDescribeSchedule>['data']
): number | null {
  if (describeSchedule?.state?.paused) {
    return null;
  }

  const ms = formatTimestampToDatetime(
    describeSchedule?.info?.nextRunTime
  )?.valueOf();
  if (typeof ms === 'number' && Number.isFinite(ms)) {
    return ms;
  }

  return null;
}

function filterChartPointsBeforeNextExecution<
  TPoint extends { scheduledTimeMs: number },
>(points: TPoint[], nextExecutionTimeMs: number | null): TPoint[] {
  if (nextExecutionTimeMs == null) {
    return points;
  }

  return points.filter(
    ({ scheduledTimeMs }) => scheduledTimeMs < nextExecutionTimeMs
  );
}

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
    () => describeScheduleToNextExecutionMs(describeQuery.data),
    [describeQuery.data]
  );
  const oldestLoadedScheduleTimeMs = useMemo(
    () => getOldestLoadedScheduleTimeMs(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const retentionSeconds = getDomainRetentionSeconds(
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
  // Depend on the jitter value rather than the polled response object, so
  // re-expanding the cron timeline is driven by real changes only.
  const jitterMs = getScheduleJitterMs(describeQuery.data);
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
        jitterMs,
        actualTimesMs: runs.map(({ scheduledTimeMs }) => scheduledTimeMs),
      }),
    [
      cronEvaluationTimeMs,
      cronExpression,
      jitterMs,
      nextExecutionTimeMs,
      oldestLoadedScheduleTimeMs,
      runs,
      timelineBounds.inferenceStartMs,
      timelineBounds.scheduleEndMs,
      workflowsQuery.hasNextPage,
    ]
  );

  const data = useMemo(
    () => ({
      runs: filterChartPointsBeforeNextExecution(runs, nextExecutionTimeMs),
      skippedExecutions: filterChartPointsBeforeNextExecution(
        skippedExecutions,
        nextExecutionTimeMs
      ),
      nextExecutionTimeMs,
    }),
    [nextExecutionTimeMs, runs, skippedExecutions]
  );

  return {
    data,
    isLoading:
      describeQuery.isLoading ||
      domainQuery.isLoading ||
      workflowsQuery.isLoading,
  };
}
