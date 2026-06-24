import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';

import { type CHART_MARGIN } from './schedule-detail-metrics-chart.constants';

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

export type MetricsChartInnerDimensions = {
  innerWidth: number;
  innerHeight: number;
  margin: typeof CHART_MARGIN;
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
