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
