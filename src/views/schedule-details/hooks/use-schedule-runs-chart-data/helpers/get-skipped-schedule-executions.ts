import { type ChartSeriesExecutionPoint } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

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
  actualTimesMs,
}: {
  cronExpression: string;
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
  oldestLoadedScheduleTimeMs: number | null;
  hasNextPage: boolean;
  nowMs: number;
  nextExecutionTimeMs?: number | null;
  jitterMs: number;
  actualTimesMs: number[];
}): ChartSeriesExecutionPoint[] {
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
      ...actualTimesMs,
      ...(nextExecutionTimeMs == null ? [] : [nextExecutionTimeMs]),
    ],
    jitterMs,
  });

  return skippedTimesMs.map((scheduledTimeMs) => ({ scheduledTimeMs }));
}
