import { type ChartSeriesExecutionPoint } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

import { type GetSkippedScheduleExecutionsParams } from '../use-schedule-runs-chart-data.types';

import getExpectedScheduleTimesMs from './get-expected-schedule-times-ms';
import getSkippedScheduleTimesMs from './get-skipped-schedule-times-ms';

export default function getSkippedScheduleExecutions({
  cronExpression,
  inferenceStartMs,
  scheduleEndMs,
  oldestLoadedScheduleTimeMs,
  hasNextPage,
  nowMs,
  nextExecutionTimeMs,
  actualTimesMs,
}: GetSkippedScheduleExecutionsParams): ChartSeriesExecutionPoint[] {
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
  });

  return skippedTimesMs.map((scheduledTimeMs) => ({ scheduledTimeMs }));
}
