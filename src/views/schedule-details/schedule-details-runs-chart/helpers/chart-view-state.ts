import {
  CHART_MIN_DOMAIN_SPAN_MS,
  CHART_NEXT_RUN_ANCHOR_RATIO,
  CHART_NOW_ANCHOR_RATIO,
} from '../schedule-details-runs-chart.constants';
import {
  type ChartTimeWindow,
  type PanChartTimeWindowToTimeParams,
  type ResolveChartFollowTimeWindowParams,
  type ShiftChartTimeWindowParams,
  type ZoomChartTimeWindowParams,
} from '../schedule-details-runs-chart.types';

export function getChartTimeWindowSpanMs(window: ChartTimeWindow): number {
  return window.maxMs - window.minMs;
}

export function isSameChartTimeWindow(
  window: ChartTimeWindow,
  otherWindow: ChartTimeWindow
): boolean {
  return (
    window.minMs === otherWindow.minMs && window.maxMs === otherWindow.maxMs
  );
}

function getWindowCenterMs(window: ChartTimeWindow): number {
  return (window.minMs + window.maxMs) / 2;
}

function expandWindowToMinSpan(window: ChartTimeWindow): ChartTimeWindow {
  const spanMs = getChartTimeWindowSpanMs(window);

  if (spanMs >= CHART_MIN_DOMAIN_SPAN_MS) {
    return window;
  }

  const centerMs = getWindowCenterMs(window);

  return {
    minMs: centerMs - CHART_MIN_DOMAIN_SPAN_MS / 2,
    maxMs: centerMs + CHART_MIN_DOMAIN_SPAN_MS / 2,
  };
}

function shiftWindowToBounds(
  window: ChartTimeWindow,
  bounds: ChartTimeWindow
): ChartTimeWindow {
  const spanMs = getChartTimeWindowSpanMs(window);
  let minMs = Math.max(window.minMs, bounds.minMs);
  let maxMs = minMs + spanMs;

  if (maxMs > bounds.maxMs) {
    maxMs = bounds.maxMs;
    minMs = maxMs - spanMs;
  }

  return { minMs, maxMs };
}

export function clampChartVisibleTimeWindow(
  visibleWindow: ChartTimeWindow,
  bounds: ChartTimeWindow
): ChartTimeWindow {
  const visibleSpanMs = getChartTimeWindowSpanMs(visibleWindow);
  const boundsSpanMs = getChartTimeWindowSpanMs(bounds);

  if (visibleSpanMs >= boundsSpanMs) {
    return bounds;
  }

  const clampedWindow = shiftWindowToBounds(visibleWindow, bounds);
  const expandedWindow = expandWindowToMinSpan(clampedWindow);
  const expandedSpanMs = getChartTimeWindowSpanMs(expandedWindow);

  if (expandedSpanMs >= boundsSpanMs) {
    return bounds;
  }

  return shiftWindowToBounds(expandedWindow, bounds);
}

export function zoomChartTimeWindow({
  visibleWindow,
  bounds,
  maxSpanMs,
  factor,
  anchorMs,
}: ZoomChartTimeWindowParams): ChartTimeWindow {
  const currentSpanMs = getChartTimeWindowSpanMs(visibleWindow);
  const nextSpanMs = Math.min(currentSpanMs * factor, maxSpanMs);
  const anchorIsVisible =
    anchorMs >= visibleWindow.minMs && anchorMs <= visibleWindow.maxMs;
  const effectiveAnchorMs = anchorIsVisible
    ? anchorMs
    : getWindowCenterMs(visibleWindow);
  const anchorRatio = anchorIsVisible
    ? (effectiveAnchorMs - visibleWindow.minMs) / currentSpanMs
    : 0.5;

  const zoomedWindow = expandWindowToMinSpan({
    minMs: effectiveAnchorMs - nextSpanMs * anchorRatio,
    maxMs: effectiveAnchorMs + nextSpanMs * (1 - anchorRatio),
  });

  return clampChartVisibleTimeWindow(zoomedWindow, bounds);
}

export function panChartTimeWindowToTime({
  visibleWindow,
  bounds,
  timeMs,
  anchorRatio = CHART_NOW_ANCHOR_RATIO,
}: PanChartTimeWindowToTimeParams): ChartTimeWindow {
  const visibleSpanMs = getChartTimeWindowSpanMs(visibleWindow);
  const clampedAnchorRatio = Math.min(Math.max(anchorRatio, 0), 1);
  const pannedWindow = {
    minMs: timeMs - visibleSpanMs * clampedAnchorRatio,
    maxMs: timeMs + visibleSpanMs * (1 - clampedAnchorRatio),
  };

  return clampChartVisibleTimeWindow(pannedWindow, bounds);
}

/**
 * Window used while live follow is active: `now` sits at its anchor unless
 * the next run would fall outside the view and still fits within the current
 * span.
 */
export function resolveChartFollowTimeWindow({
  visibleWindow,
  bounds,
  nowMs,
  nextExecutionMs,
}: ResolveChartFollowTimeWindowParams): ChartTimeWindow {
  const spanMs = getChartTimeWindowSpanMs(visibleWindow);
  const nowAnchoredWindow = panChartTimeWindowToTime({
    visibleWindow,
    bounds,
    timeMs: nowMs,
  });

  if (
    nextExecutionMs == null ||
    !Number.isFinite(nextExecutionMs) ||
    nextExecutionMs <= nowAnchoredWindow.maxMs
  ) {
    return nowAnchoredWindow;
  }

  const nextRunAnchoredWindow = panChartTimeWindowToTime({
    visibleWindow,
    bounds,
    timeMs: nextExecutionMs,
    anchorRatio: CHART_NEXT_RUN_ANCHOR_RATIO,
  });

  return nextRunAnchoredWindow.minMs <= nowMs && spanMs > 0
    ? nextRunAnchoredWindow
    : nowAnchoredWindow;
}

export function shiftChartTimeWindow({
  visibleWindow,
  deltaMs,
  bounds,
}: ShiftChartTimeWindowParams): ChartTimeWindow {
  const spanMs = getChartTimeWindowSpanMs(visibleWindow);
  let minMs = visibleWindow.minMs + deltaMs;
  let maxMs = visibleWindow.maxMs + deltaMs;

  if (bounds) {
    if (minMs < bounds.minMs) {
      minMs = bounds.minMs;
      maxMs = minMs + spanMs;
    }

    if (maxMs > bounds.maxMs) {
      maxMs = bounds.maxMs;
      minMs = maxMs - spanMs;
    }
  }

  return { minMs, maxMs };
}

export function canZoomChartIn(visibleWindow: ChartTimeWindow): boolean {
  return getChartTimeWindowSpanMs(visibleWindow) > CHART_MIN_DOMAIN_SPAN_MS;
}

export function canZoomChartOut(
  visibleWindow: ChartTimeWindow,
  maxSpanMs: number
): boolean {
  return getChartTimeWindowSpanMs(visibleWindow) < maxSpanMs;
}
