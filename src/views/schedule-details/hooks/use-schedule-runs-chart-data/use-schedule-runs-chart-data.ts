'use client';
import { useMemo } from 'react';

import formatTimestampToMs from '@/utils/data-formatters/format-timestamp-to-ms';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import getScheduleExecutionGaps from './helpers/get-schedule-execution-gaps';
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
  // Rounded to the minute so a per-second `nowMs` tick does not re-walk the
  // cron timeline on every render.
  const cronEvaluationTimeMs = Math.floor(nowMs / 60_000) * 60_000;

  const runs = useMemo(
    () => workflowsForScheduleToChartSeriesRuns(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const nextExecutionTimeMs = useMemo(() => {
    if (describeQuery.data?.state?.paused) {
      return null;
    }

    return formatTimestampToMs(describeQuery.data?.info?.nextRunTime);
  }, [describeQuery.data]);
  // Runs are already filtered to those with a parsable scheduled time, so the
  // oldest loaded slot is just the minimum of what's already been mapped.
  const oldestLoadedScheduleTimeMs = useMemo(
    () =>
      runs.length > 0
        ? Math.min(...runs.map(({ scheduledTimeMs }) => scheduledTimeMs))
        : null,
    [runs]
  );
  const timelineBounds = useMemo(
    () =>
      getScheduleTimelineBounds({
        describeSchedule: describeQuery.data,
      }),
    [describeQuery.data]
  );
  const cronExpression = describeQuery.data?.spec?.cronExpression ?? '';
  const { skippedExecutions, unconfirmedExecutions } = useMemo(
    () =>
      getScheduleExecutionGaps({
        cronExpression,
        scheduleStartMs: timelineBounds.scheduleStartMs,
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
      timelineBounds.scheduleStartMs,
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
      unconfirmedExecutions: unconfirmedExecutions.filter(
        isBeforeNextExecution
      ),
      nextExecutionTimeMs,
    };
  }, [nextExecutionTimeMs, unconfirmedExecutions, runs, skippedExecutions]);

  return {
    data,
    isLoading: describeQuery.isLoading || workflowsQuery.isLoading,
  };
}
