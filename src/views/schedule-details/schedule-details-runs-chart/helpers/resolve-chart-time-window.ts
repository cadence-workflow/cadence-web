import {
  CHART_DEFAULT_PAST_WINDOW_MS,
  CHART_FUTURE_GUTTER_MS,
  CHART_MIN_DOMAIN_SPAN_MS,
} from '../schedule-details-runs-chart.constants';
import {
  type ChartTimeWindow,
  type ResolveChartTimeWindowParams,
} from '../schedule-details-runs-chart.types';

export default function resolveChartTimeWindow({
  timestampsMs,
  nowMs,
  nextExecutionMs,
  futureGutterMs = CHART_FUTURE_GUTTER_MS,
  minimumTimeMs,
}: ResolveChartTimeWindowParams): ChartTimeWindow | null {
  if (!Number.isFinite(nowMs)) {
    return null;
  }

  const validTimestampsMs = timestampsMs.filter(Number.isFinite);

  let minMs: number;
  let maxMs: number;

  if (validTimestampsMs.length === 0 && nextExecutionMs == null) {
    // Nothing to anchor on yet (no runs, no known next execution):
    // fall back to a fixed lookback window ending just past now.
    minMs = Math.max(
      nowMs - CHART_DEFAULT_PAST_WINDOW_MS,
      minimumTimeMs ?? Number.NEGATIVE_INFINITY
    );
    maxMs = nowMs + futureGutterMs;
  } else {
    // With no runs yet, dataMinMs/dataMaxMs fall back to nowMs so the window
    // still anchors on now instead of on an empty range.
    const dataMinMs =
      validTimestampsMs.length > 0 ? Math.min(...validTimestampsMs) : nowMs;
    const dataMaxMs =
      validTimestampsMs.length > 0 ? Math.max(...validTimestampsMs) : nowMs;

    minMs = Math.max(
      Math.min(dataMinMs, nowMs),
      minimumTimeMs ?? Number.NEGATIVE_INFINITY
    );
    maxMs = Math.max(dataMaxMs, nowMs, nowMs + futureGutterMs);

    // A known next execution can push the right edge further than the
    // default future gutter (e.g. an hourly schedule needs more lead space
    // than the 30-minute default).
    if (
      nextExecutionMs != null &&
      Number.isFinite(nextExecutionMs) &&
      nextExecutionMs > nowMs
    ) {
      maxMs = Math.max(maxMs, nextExecutionMs + futureGutterMs);
    }
  }

  // Guard against a degenerate (zero- or near-zero-width) window, which would
  // otherwise produce an unusable or inverted x-scale.
  if (maxMs <= minMs) {
    maxMs = minMs + CHART_MIN_DOMAIN_SPAN_MS;
  } else if (maxMs - minMs < CHART_MIN_DOMAIN_SPAN_MS) {
    const centerMs = (minMs + maxMs) / 2;
    minMs = centerMs - CHART_MIN_DOMAIN_SPAN_MS / 2;
    maxMs = centerMs + CHART_MIN_DOMAIN_SPAN_MS / 2;
  }

  return { minMs, maxMs };
}
