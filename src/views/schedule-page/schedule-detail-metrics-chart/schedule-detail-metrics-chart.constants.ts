export const CHART_HEIGHT_PX = 280;

export const CHART_TOOLBAR_BUTTON_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitAll: 'Fit all',
  now: 'Now',
} as const;

export const CHART_EMPTY_STATE_MESSAGE = 'No chart data available yet';

export const CHART_REGION_ARIA_LABEL = 'Schedule metrics chart';

export const CHART_TOOLBAR_ARIA_LABEL = 'Chart controls';

/** Minimum time span when domain collapses to a single timestamp (ms). */
export const CHART_MIN_DOMAIN_SPAN_MS = 5 * 60_000;

/** Default past window when no run timestamps are available (ms). */
export const CHART_DEFAULT_PAST_WINDOW_MS = 6 * 60 * 60_000;

/** Padding to the right of `now` reserved for upcoming expected executions (ms). */
export const CHART_FUTURE_GUTTER_MS = 30 * 60_000;

/** Horizontal inset applied to the chart drawable area (px). */
export const CHART_SIDE_PADDING_PX = 24;

export const CHART_SERIES_TEST_IDS = {
  svg: 'schedule-metrics-chart-series-svg',
  successfulRunMarker: 'schedule-metrics-chart-successful-run-marker',
  missedExecutionMarker: 'schedule-metrics-chart-missed-execution-marker',
  nextExecutionMarker: 'schedule-metrics-chart-next-execution-marker',
} as const;

export const CHART_SERIES_MARKER_RADIUS_PX = 5;
export const CHART_SERIES_MISSED_MARKER_RADIUS_PX = 6;
export const CHART_SERIES_NEXT_EXECUTION_STROKE_WIDTH_PX = 2;
export const CHART_SERIES_MISSED_STROKE_WIDTH_PX = 2;
export const CHART_SERIES_SUCCESS_Y_RATIO = 0.45;
export const CHART_SERIES_MISSED_Y_RATIO = 0.65;

export const CHART_WORKFLOWS_PAGE_SIZE = 20;

export const CHART_DEFAULT_VIEW_SPAN_MS = 6 * 60 * 60_000;

export const CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO = 0.05;

export const CHART_LOADING_SKELETON_TEST_ID =
  'schedule-metrics-chart-loading-skeleton';

export const CHART_FETCH_LOADING_TEST_ID =
  'schedule-metrics-chart-fetch-loading';

export const CHART_GLYPH_HIT_AREA_RADIUS_PX = 12;

export const CHART_RUN_POPOVER_ENTRY_DELAY_MS = 200;

export const CHART_GLYPH_TEST_IDS = {
  successfulRunTrigger: 'schedule-metrics-chart-successful-run-trigger',
  missedExecutionTrigger: 'schedule-metrics-chart-missed-execution-trigger',
} as const;
