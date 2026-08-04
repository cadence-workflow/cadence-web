import { type ScaleLinear } from 'd3-scale';

import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';

export type Props = {
  params: SchedulePageTabsParams;
};

export type ChartXScale = ScaleLinear<number, number, never>;

export type ChartTimeWindow = {
  minMs: number;
  maxMs: number;
};

export type ChartPixelRange = {
  startPx: number;
  endPx: number;
};

export type ResolveChartTimeWindowParams = {
  timestampsMs: number[];
  nowMs: number;
  nextExecutionMs?: number | null;
  futureGutterMs?: number;
  minimumTimeMs?: number | null;
};

export type ResolveChartPixelRangeParams = {
  widthPx: number;
  sidePaddingPx?: number;
};

export type CreateChartXScaleParams = {
  timeWindow: ChartTimeWindow;
  range: ChartPixelRange;
};

export type ZoomChartTimeWindowParams = {
  visibleWindow: ChartTimeWindow;
  bounds: ChartTimeWindow;
  maxSpanMs: number;
  factor: number;
  anchorMs: number;
};

export type PanChartTimeWindowToTimeParams = {
  visibleWindow: ChartTimeWindow;
  bounds: ChartTimeWindow;
  timeMs: number;
  anchorRatio?: number;
};

export type ResolveChartFollowTimeWindowParams = {
  visibleWindow: ChartTimeWindow;
  bounds: ChartTimeWindow;
  nowMs: number;
  nextExecutionMs?: number | null;
};

export type ShiftChartTimeWindowParams = {
  visibleWindow: ChartTimeWindow;
  deltaMs: number;
  bounds?: ChartTimeWindow | null;
};

export type ResolveInitialChartTimeWindowParams = {
  nowMs: number;
  chartWidthPx: number;
  nextExecutionMs?: number | null;
  /** Actual run times plus inferred skipped/unconfirmed slots, used to size how much history reads well at the initial zoom. */
  timestampsMs?: number[];
  futureGutterMs?: number;
};
