import { CronExpressionParser } from 'cron-parser';

import { cronValidate } from '@/utils/cron-validate/cron-validate';

import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_EXPECTED_RUN_SLOT_PX,
  CHART_INITIAL_EXPECTED_RUN_COUNT,
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NOW_ANCHOR_RATIO,
  CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX,
  CHART_SIDE_PADDING_PX,
} from '../schedule-details-runs-chart.constants';
import {
  type ResolveInitialChartTimeWindowParams,
  type ResolveInitialChartTimeWindowResult,
} from '../schedule-details-runs-chart.types';

export default function resolveInitialChartTimeWindow({
  nowMs,
  chartWidthPx,
  cronExpression,
  nextExecutionMs,
}: ResolveInitialChartTimeWindowParams): ResolveInitialChartTimeWindowResult {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;
  let scheduleIntervalMs: number | null = null;

  if (cronValidate(cronExpression).isValid() && Number.isFinite(nowMs)) {
    try {
      const cronInterval = CronExpressionParser.parse(cronExpression, {
        currentDate: nowMs,
        tz: 'UTC',
      });
      const nextOccurrenceMs = cronInterval.next().toDate().getTime();
      const followingOccurrenceMs = cronInterval.next().toDate().getTime();
      const intervalMs = followingOccurrenceMs - nextOccurrenceMs;

      scheduleIntervalMs = intervalMs > 0 ? intervalMs : null;
    } catch {
      scheduleIntervalMs = null;
    }
  }

  scheduleIntervalMs ??=
    nextExecutionMs != null &&
    Number.isFinite(nextExecutionMs) &&
    nextExecutionMs > nowMs
      ? nextExecutionMs - nowMs
      : Math.max(
          CHART_MIN_DOMAIN_SPAN_MS,
          CHART_DEFAULT_PAST_WINDOW_MS /
            Math.min(
              CHART_INITIAL_EXPECTED_RUN_COUNT,
              Math.max(
                1,
                Math.floor(drawableWidthPx / CHART_EXPECTED_RUN_SLOT_PX)
              )
            )
        );

  const canResolveSpan =
    Number.isFinite(scheduleIntervalMs) &&
    scheduleIntervalMs > 0 &&
    Number.isFinite(chartWidthPx) &&
    chartWidthPx > 0 &&
    drawableWidthPx > 0;
  const comfortableSpanMs = canResolveSpan
    ? (scheduleIntervalMs * drawableWidthPx) / CHART_EXPECTED_RUN_SLOT_PX
    : 0;
  const maxSpanMs = canResolveSpan
    ? (scheduleIntervalMs * drawableWidthPx) /
      CHART_MAX_ZOOM_OUT_MARKER_SPACING_PX
    : 0;
  const windowSpanMs = Math.max(comfortableSpanMs, CHART_MIN_DOMAIN_SPAN_MS);
  const resolvedMaxSpanMs = Math.max(maxSpanMs, windowSpanMs);
  const window = {
    minMs: nowMs - windowSpanMs * CHART_NOW_ANCHOR_RATIO,
    maxMs: nowMs + windowSpanMs * (1 - CHART_NOW_ANCHOR_RATIO),
  };

  return { window, maxSpanMs: resolvedMaxSpanMs };
}
