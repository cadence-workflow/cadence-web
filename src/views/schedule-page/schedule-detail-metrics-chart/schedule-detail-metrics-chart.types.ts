import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';

export type Props = {
  params: SchedulePageTabsParams;
};

export type MetricsChartTimeDomain = {
  minMs: number;
  maxMs: number;
};

export type MetricsChartPixelRange = {
  startPx: number;
  endPx: number;
};

export type ResolveMetricsChartTimeDomainParams = {
  timestampsMs: number[];
  nowMs: number;
  nextExecutionMs?: number | null;
};

export type ResolveMetricsChartPixelRangeParams = {
  widthPx: number;
  sidePaddingPx?: number;
};

export type CreateMetricsChartXScaleParams = {
  domain: MetricsChartTimeDomain;
  range: MetricsChartPixelRange;
};
