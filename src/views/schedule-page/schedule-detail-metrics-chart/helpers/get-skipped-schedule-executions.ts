import { type ScheduleMetricsChartExecutionPoint } from '../schedule-detail-metrics-chart-series.types';

import {
  getExpectedScheduleTimesMs,
  getSkippedScheduleTimesMs,
} from './get-schedule-cron-timeline';

export default function getSkippedScheduleExecutions({
  cronExpression,
  inferenceStartMs,
  scheduleEndMs,
  oldestLoadedScheduleTimeMs,
  hasNextPage,
  nowMs,
  nextExecutionTimeMs,
  jitterMs,
  actualExecutions,
}: {
  cronExpression: string;
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
  oldestLoadedScheduleTimeMs: number | null;
  hasNextPage: boolean;
  nowMs: number;
  nextExecutionTimeMs?: number | null;
  jitterMs: number;
  actualExecutions: ScheduleMetricsChartExecutionPoint[];
}): ScheduleMetricsChartExecutionPoint[] {
  if (inferenceStartMs == null) {
    return [];
  }

  if (hasNextPage && oldestLoadedScheduleTimeMs == null) {
    return [];
  }

  const trustworthyStartMs =
    hasNextPage && oldestLoadedScheduleTimeMs != null
      ? Math.max(inferenceStartMs, oldestLoadedScheduleTimeMs)
      : inferenceStartMs;
  const trustworthyEndMs =
    scheduleEndMs == null ? nowMs : Math.min(nowMs, scheduleEndMs);

  if (trustworthyEndMs < trustworthyStartMs) {
    return [];
  }

  const expectedTimesMs = getExpectedScheduleTimesMs({
    cronExpression,
    startMs: trustworthyStartMs,
    endMs: trustworthyEndMs,
  });
  const skippedTimesMs = getSkippedScheduleTimesMs({
    expectedTimesMs,
    actualTimesMs: [
      ...actualExecutions.map(({ scheduledTimeMs }) => scheduledTimeMs),
      ...(nextExecutionTimeMs == null ? [] : [nextExecutionTimeMs]),
    ],
    jitterMs,
  });

  return skippedTimesMs.map((scheduledTimeMs) => ({
    scheduledTimeMs,
    runs: [],
  }));
}
