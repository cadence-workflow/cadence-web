export const CHART_HEIGHT_PX = 280;

export const CHART_MARGIN = {
  top: 12,
  right: 24,
  bottom: 36,
  left: 44,
} as const;

export const DEFAULT_TIME_WINDOW_MS = 60 * 60 * 1000;

export const FUTURE_GUTTER_RATIO = 0.15;

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
