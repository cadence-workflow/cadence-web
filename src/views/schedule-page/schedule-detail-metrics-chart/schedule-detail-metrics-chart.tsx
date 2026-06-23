'use client';
import React from 'react';

import { ParentSize } from '@visx/responsive';
import {
  MdFitScreen,
  MdGpsFixed,
  MdZoomIn,
  MdZoomOut,
} from 'react-icons/md';

import Button from '@/components/button/button';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { scheduleMetricsChartFixture } from './__fixtures__/schedule-detail-metrics-chart-fixture';
import hasScheduleMetricsChartData from './helpers/has-schedule-metrics-chart-data';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from './schedule-detail-metrics-chart.constants';
import {
  createMetricsChartXScale,
  resolveMetricsChartPixelRange,
  resolveMetricsChartTimeDomain,
} from './schedule-detail-metrics-chart-scales';
import ScheduleDetailMetricsChartSeries from './schedule-detail-metrics-chart-series';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import { type Props } from './schedule-detail-metrics-chart.types';

export default function ScheduleDetailMetricsChart(_props: Props) {
  const { theme } = useStyletronClasses({});
  const chartData = scheduleMetricsChartFixture;
  const hasChartData = hasScheduleMetricsChartData(chartData);

  return (
    <styled.Container>
      <styled.Toolbar role="toolbar" aria-label={CHART_TOOLBAR_ARIA_LABEL}>
        <Button
          size="mini"
          kind="tertiary"
          shape="pill"
          disabled
          aria-disabled
          overrides={overrides.toolbarButton}
          aria-label={CHART_TOOLBAR_BUTTON_LABELS.zoomIn}
        >
          <MdZoomIn size={16} />
        </Button>
        <Button
          size="mini"
          kind="tertiary"
          shape="pill"
          disabled
          aria-disabled
          overrides={overrides.toolbarButton}
          aria-label={CHART_TOOLBAR_BUTTON_LABELS.zoomOut}
        >
          <MdZoomOut size={16} />
        </Button>
        <Button
          size="mini"
          kind="tertiary"
          shape="pill"
          disabled
          aria-disabled
          overrides={overrides.toolbarButton}
          aria-label={CHART_TOOLBAR_BUTTON_LABELS.fitAll}
        >
          <MdFitScreen size={16} />
        </Button>
        <Button
          size="mini"
          kind="tertiary"
          shape="pill"
          disabled
          aria-disabled
          overrides={overrides.toolbarButton}
          aria-label={CHART_TOOLBAR_BUTTON_LABELS.now}
        >
          <MdGpsFixed size={16} />
        </Button>
      </styled.Toolbar>
      <styled.ChartRegion role="region" aria-label={CHART_REGION_ARIA_LABEL}>
        <ParentSize>
          {({ width = 0, height = 0 }) => {
            const chartWidth = Math.max(width, 0);
            const chartHeight = Math.max(height, 0);

            if (!hasChartData || chartWidth === 0 || chartHeight === 0) {
              return (
                <styled.EmptyState role="status">
                  {CHART_EMPTY_STATE_MESSAGE}
                </styled.EmptyState>
              );
            }

            const timestampsMs = [
              ...chartData.successfulRuns.map(
                ({ scheduledTimeMs }) => scheduledTimeMs
              ),
              ...chartData.missedExecutions.map(
                ({ scheduledTimeMs }) => scheduledTimeMs
              ),
            ];
            const domain = resolveMetricsChartTimeDomain({
              timestampsMs,
              nowMs: Date.now(),
              nextExecutionMs: chartData.nextExecutionTimeMs,
            });
            const pixelRange = resolveMetricsChartPixelRange({
              widthPx: chartWidth,
            });
            const xScale =
              domain && pixelRange
                ? createMetricsChartXScale({ domain, range: pixelRange })
                : null;

            if (!xScale) {
              return (
                <styled.EmptyState role="status">
                  {CHART_EMPTY_STATE_MESSAGE}
                </styled.EmptyState>
              );
            }

            return (
              <styled.ChartCanvas data-testid="schedule-metrics-chart-canvas">
                <styled.ChartSvg width={chartWidth} height={chartHeight}>
                  <ScheduleDetailMetricsChartSeries
                    width={chartWidth}
                    height={chartHeight}
                    xScale={xScale}
                    data={chartData}
                    successfulRunColor={theme.colors.positive400}
                    missedExecutionColor={theme.colors.warning400}
                    nextExecutionColor={theme.colors.accent400}
                  />
                </styled.ChartSvg>
              </styled.ChartCanvas>
            );
          }}
        </ParentSize>
      </styled.ChartRegion>
    </styled.Container>
  );
}
