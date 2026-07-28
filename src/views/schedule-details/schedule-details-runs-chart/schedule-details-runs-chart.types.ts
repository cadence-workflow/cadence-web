import { type ScaleLinear } from 'd3-scale';

import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';

export type Props = {
  params: SchedulePageTabsParams;
};

export type RunsChartXScale = ScaleLinear<number, number, never>;

export type RunsChartTimeDomain = {
  minMs: number;
  maxMs: number;
};

export type RunsChartPixelRange = {
  startPx: number;
  endPx: number;
};

export type ResolveRunsChartTimeDomainParams = {
  timestampsMs: number[];
  nowMs: number;
  nextExecutionMs?: number | null;
  futureGutterMs?: number;
  minimumTimeMs?: number | null;
};

export type ResolveRunsChartPixelRangeParams = {
  widthPx: number;
  sidePaddingPx?: number;
};

export type CreateRunsChartXScaleParams = {
  domain: RunsChartTimeDomain;
  range: RunsChartPixelRange;
};
