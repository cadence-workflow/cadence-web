export const CHART_HEIGHT_PX = 280;

export const CHART_MARGIN = {
  top: 12,
  right: 24,
  bottom: 36,
  left: 44,
} as const;

export const DEFAULT_Y_AXIS_MAX = 10;

export const CURRENT_TIME_UPDATE_INTERVAL_MS = 30_000;

export const CHART_TOOLBAR_BUTTON_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitAll: 'Fit all',
  now: 'Now',
} as const;

export const CHART_REGION_ARIA_LABEL = 'Schedule metrics chart';

export const CHART_TOOLBAR_ARIA_LABEL = 'Chart controls';

export const CHART_SVG_TEST_ID = 'schedule-metrics-chart-svg';

export const CHART_NOW_LINE_TEST_ID = 'schedule-metrics-chart-now-line';

/** Minimum time span when domain collapses to a single timestamp (ms). */
export const CHART_MIN_DOMAIN_SPAN_MS = 5 * 60_000;

/** Default past window when no run timestamps are available (ms). */
export const CHART_DEFAULT_PAST_WINDOW_MS = 6 * 60 * 60_000;

/** Padding to the right of `now` reserved for upcoming expected executions (ms). */
export const CHART_FUTURE_GUTTER_MS = 30 * 60_000;

/** Horizontal inset applied to the chart drawable area (px). */
export const CHART_SIDE_PADDING_PX = 24;
