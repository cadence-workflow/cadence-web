export const CHART_HEIGHT_PX = 82;

/** Header row height, sized to fit the mini toolbar buttons (px). */
export const CHART_HEADER_MIN_HEIGHT_PX = 28;
export const CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX = 26;

/** Icon size for the toolbar control glyphs (px). */
export const CHART_TOOLBAR_ICON_SIZE_PX = 12;

export const CHART_TOOLBAR_BUTTON_LABELS = {
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  now: 'Now',
} as const;

export const CHART_EMPTY_STATE_MESSAGE = 'No chart data available yet';

export const CHART_LOADING_ARIA_LABEL = 'Loading schedule runs chart';

export const CHART_LOADING_TEST_ID = 'schedule-runs-chart-loading-skeleton';

export const CHART_REGION_ARIA_LABEL = 'Schedule runs chart';

export const CHART_TOOLBAR_ARIA_LABEL = 'Chart controls';

/**
 * How often `now` is re-read. Every tick shifts the time window, re-rendering
 * the timeline. That is well within budget at 1s, which is the coarsest the
 * marker can move and still read as advancing rather than stepping.
 */
export const CURRENT_TIME_UPDATE_INTERVAL_MS = 1_000;

/** Minimum time span when domain collapses to a single timestamp (ms). */
export const CHART_MIN_DOMAIN_SPAN_MS = 5 * 60_000;

/** Default past window when no run timestamps are available (ms). */
export const CHART_DEFAULT_PAST_WINDOW_MS = 6 * 60 * 60_000;

/** Padding to the right of `now` reserved for upcoming expected executions (ms). */
export const CHART_FUTURE_GUTTER_MS = 30 * 60_000;

/** Horizontal inset applied to the chart drawable area (px). */
export const CHART_SIDE_PADDING_PX = 24;
