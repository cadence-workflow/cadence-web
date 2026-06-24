'use client';
import React, { useMemo } from 'react';

import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { Line } from '@visx/shape';
import { useStyletron } from 'baseui';
import {
  MdFitScreen,
  MdGpsFixed,
  MdZoomIn,
  MdZoomOut,
} from 'react-icons/md';

import Button from '@/components/button/button';

import { scheduleMetricsChartFixture } from './__fixtures__/schedule-detail-metrics-chart-fixture';
import formatChartTimeTick from './helpers/format-chart-time-tick';
import hasScheduleMetricsChartData from './helpers/has-schedule-metrics-chart-data';
import useCurrentTimeMs from './hooks/use-current-time-ms';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_NOW_LINE_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SVG_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  DEFAULT_Y_AXIS_MAX,
} from './schedule-detail-metrics-chart.constants';
import {
  createMetricsChartXScale,
  createMetricsChartYScale,
  getMetricsChartInnerDimensions,
  resolveMetricsChartTimeDomain,
} from './schedule-detail-metrics-chart-scales';
import ScheduleDetailMetricsChartSeries from './schedule-detail-metrics-chart-series';
import { type ScheduleMetricsChartSeriesData } from './schedule-detail-metrics-chart-series.types';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import { type Props } from './schedule-detail-metrics-chart.types';

type ChartSvgProps = {
  width: number;
  height: number;
  chartData: ScheduleMetricsChartSeriesData;
};

function ScheduleMetricsChartSvg({
  width,
  height,
  chartData,
}: ChartSvgProps) {
  const [, theme] = useStyletron();
  const currentTimeMs = useCurrentTimeMs();

  const { innerWidth, innerHeight, margin } = useMemo(
    () => getMetricsChartInnerDimensions(width, height),
    [width, height]
  );

  const timestampsMs = useMemo(
    () => [
      ...chartData.successfulRuns.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
      ...chartData.missedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
    ],
    [chartData]
  );

  const timeDomain = useMemo(
    () =>
      resolveMetricsChartTimeDomain({
        timestampsMs,
        nowMs: currentTimeMs,
        nextExecutionMs: chartData.nextExecutionTimeMs,
      }),
    [timestampsMs, currentTimeMs, chartData.nextExecutionTimeMs]
  );

  const xScale = useMemo(() => {
    if (timeDomain == null || innerWidth <= 0) {
      return null;
    }

    return createMetricsChartXScale({
      domain: timeDomain,
      range: { startPx: 0, endPx: innerWidth },
    });
  }, [timeDomain, innerWidth]);

  const yScale = useMemo(
    () =>
      createMetricsChartYScale({
        maxCount: DEFAULT_Y_AXIS_MAX,
        innerHeight,
      }),
    [innerHeight]
  );

  const xTickCount = Math.min(8, Math.max(2, Math.floor(innerWidth / 80)));
  const yTickCount = Math.min(6, Math.max(2, Math.floor(innerHeight / 40)));
  const nowLineX = xScale?.(currentTimeMs);

  if (innerWidth <= 0 || innerHeight <= 0 || xScale == null) {
    return null;
  }

  const gridStroke = theme.colors.borderOpaque;
  const tickLabelColor = theme.colors.contentSecondary;
  const axisStroke = theme.colors.borderOpaque;

  return (
    <styled.ChartSvg
      width={width}
      height={height}
      data-testid={CHART_SVG_TEST_ID}
    >
      <Group left={margin.left} top={margin.top}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={gridStroke}
          numTicks={yTickCount}
        />
        <GridColumns
          scale={xScale}
          height={innerHeight}
          stroke={gridStroke}
          numTicks={xTickCount}
        />
        <AxisLeft
          scale={yScale}
          numTicks={yTickCount}
          stroke={axisStroke}
          tickStroke={axisStroke}
          tickLabelProps={() => ({
            fill: tickLabelColor,
            fontSize: 10,
            fontFamily: theme.typography.LabelXSmall.fontFamily,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          numTicks={xTickCount}
          stroke={axisStroke}
          tickStroke={axisStroke}
          tickFormat={(value) => formatChartTimeTick(Number(value))}
          tickLabelProps={() => ({
            fill: tickLabelColor,
            fontSize: 10,
            fontFamily: theme.typography.LabelXSmall.fontFamily,
            textAnchor: 'middle',
            dy: '0.25em',
          })}
        />
        <ScheduleDetailMetricsChartSeries
          width={innerWidth}
          height={innerHeight}
          xScale={xScale}
          data={chartData}
          successfulRunColor={theme.colors.positive400}
          missedExecutionColor={theme.colors.warning400}
          nextExecutionColor={theme.colors.accent400}
        />
        {nowLineX != null && nowLineX >= 0 && nowLineX <= innerWidth && (
          <Line
            data-testid={CHART_NOW_LINE_TEST_ID}
            from={{ x: nowLineX, y: 0 }}
            to={{ x: nowLineX, y: innerHeight }}
            stroke={theme.colors.contentAccent}
            strokeWidth={2}
            pointerEvents="none"
          />
        )}
      </Group>
    </styled.ChartSvg>
  );
}

export default function ScheduleDetailMetricsChart(_props: Props) {
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

            return (
              <ScheduleMetricsChartSvg
                width={chartWidth}
                height={chartHeight}
                chartData={chartData}
              />
            );
          }}
        </ParentSize>
      </styled.ChartRegion>
    </styled.Container>
  );
}
