'use client';
import { useMemo } from 'react';

import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useDomainDescription from '@/views/shared/hooks/use-domain-description/use-domain-description';

import getScheduleExecutionGaps from './helpers/get-schedule-execution-gaps';
import getScheduleNextExecutionTimeMs from './helpers/get-schedule-next-execution-time-ms';
import getScheduleTimelineBounds from './helpers/get-schedule-timeline-bounds';
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
  // Runs are already filtered to those with a parsable scheduled time, so the
  // oldest loaded slot is just the minimum of what's already been mapped.
  const oldestLoadedScheduleTimeMs = useMemo(
    () =>
      runs.length > 0
        ? Math.min(...runs.map(({ scheduledTimeMs }) => scheduledTimeMs))
        : null,
    [runs]
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
  const { skippedExecutions, pendingExecutions } = useMemo(
    () =>
      getScheduleExecutionGaps({
        cronExpression,
        inferenceStartMs: timelineBounds.inferenceStartMs,
        scheduleEndMs: timelineBounds.scheduleEndMs,
        oldestLoadedScheduleTimeMs,
        hasNextPage: workflowsQuery.hasNextPage ?? false,
        lastFetchedAtMs: workflowsQuery.dataUpdatedAt || null,
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
      workflowsQuery.dataUpdatedAt,
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
      pendingExecutions: pendingExecutions.filter(isBeforeNextExecution),
      nextExecutionTimeMs,
    };
  }, [nextExecutionTimeMs, pendingExecutions, runs, skippedExecutions]);

  return {
    data,
    isLoading:
      describeQuery.isLoading ||
      domainQuery.isLoading ||
      workflowsQuery.isLoading,
  };
}
