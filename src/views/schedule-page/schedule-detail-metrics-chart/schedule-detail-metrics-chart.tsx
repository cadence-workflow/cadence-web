'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useListWorkflowsForSchedule from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';

import describeScheduleToNextExecutionMs from './helpers/describe-schedule-to-next-execution';
import formatChartTimeTick from './helpers/format-chart-time-tick';
import hasScheduleMetricsChartData from './helpers/has-schedule-metrics-chart-data';
import resolveInitialMetricsChartViewDomain from './helpers/resolve-initial-metrics-chart-view-domain';
import shiftMetricsChartViewDomain from './helpers/shift-metrics-chart-view-domain';
import workflowsForScheduleToChartPoints, {
  getOldestLoadedScheduleTimeMs,
} from './helpers/workflows-for-schedule-to-chart-points';
import useCurrentTimeMs from './hooks/use-current-time-ms';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_NOW_LINE_TEST_ID,
  CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO,
  CHART_REGION_ARIA_LABEL,
  CHART_SVG_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_WORKFLOWS_PAGE_SIZE,
  DEFAULT_Y_AXIS_MAX,
} from './schedule-detail-metrics-chart.constants';
import ScheduleDetailMetricsChartLoading from './schedule-detail-metrics-chart-loading';
import {
  createMetricsChartXScale,
  createMetricsChartYScale,
  getMetricsChartInnerDimensions,
  resolveMetricsChartTimeDomain,
} from './schedule-detail-metrics-chart-scales';
import ScheduleDetailMetricsChartSeries from './schedule-detail-metrics-chart-series';
import { type ScheduleMetricsChartSeriesData } from './schedule-detail-metrics-chart-series.types';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import { type MetricsChartTimeDomain, type Props } from './schedule-detail-metrics-chart.types';

type ChartSvgProps = {
  width: number;
  height: number;
  chartData: ScheduleMetricsChartSeriesData;
  viewDomain: MetricsChartTimeDomain;
};

function ScheduleMetricsChartSvg({
  width,
  height,
  chartData,
  viewDomain,
}: ChartSvgProps) {
  const [, theme] = useStyletron();
  const currentTimeMs = useCurrentTimeMs();

  const { innerWidth, innerHeight, margin } = useMemo(
    () => getMetricsChartInnerDimensions(width, height),
    [width, height]
  );

  const xScale = useMemo(() => {
    if (innerWidth <= 0) {
      return null;
    }

    return createMetricsChartXScale({
      domain: viewDomain,
      range: { startPx: 0, endPx: innerWidth },
    });
  }, [viewDomain, innerWidth]);

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

type PanState = {
  startClientX: number;
  startViewDomain: MetricsChartTimeDomain;
};

export default function ScheduleDetailMetricsChart({ params }: Props) {
  const { domain, cluster, scheduleId } = params;
  const [viewDomain, setViewDomain] = useState<MetricsChartTimeDomain | null>(
    null
  );
  const [isPanning, setIsPanning] = useState(false);
  const panStateRef = useRef<PanState | null>(null);
  const chartWidthRef = useRef(0);

  const describeQuery = useDescribeSchedule({ domain, cluster, scheduleId });
  const workflowsQuery = useListWorkflowsForSchedule({
    domain,
    cluster,
    scheduleId,
    pageSize: CHART_WORKFLOWS_PAGE_SIZE,
  });

  const chartPoints = useMemo(
    () => workflowsForScheduleToChartPoints(workflowsQuery.data),
    [workflowsQuery.data]
  );

  const nextExecutionTimeMs = useMemo(
    () => describeScheduleToNextExecutionMs(describeQuery.data),
    [describeQuery.data]
  );

  const chartData = useMemo(
    () => ({
      ...chartPoints,
      nextExecutionTimeMs,
    }),
    [chartPoints, nextExecutionTimeMs]
  );

  const timestampsMs = useMemo(
    () => [
      ...chartData.successfulRuns.map(({ scheduledTimeMs }) => scheduledTimeMs),
      ...chartData.missedExecutions.map(({ scheduledTimeMs }) => scheduledTimeMs),
    ],
    [chartData]
  );

  const nowMs = Date.now();

  const isInitialLoading =
    describeQuery.isLoading || workflowsQuery.isLoading;
  const isFetchingMore =
    workflowsQuery.isFetchingNextPage ||
    (workflowsQuery.isFetching && !workflowsQuery.isLoading);

  const scrollBounds = useMemo(
    () =>
      resolveMetricsChartTimeDomain({
        timestampsMs,
        nowMs,
        nextExecutionMs: nextExecutionTimeMs,
      }),
    [timestampsMs, nowMs, nextExecutionTimeMs]
  );

  const panBounds = useMemo(
    () =>
      scrollBounds
        ? {
            minMs: Number.NEGATIVE_INFINITY,
            maxMs: scrollBounds.maxMs,
          }
        : null,
    [scrollBounds]
  );

  useEffect(() => {
    if (viewDomain != null || isInitialLoading || scrollBounds == null) {
      return;
    }

    setViewDomain(
      resolveInitialMetricsChartViewDomain({
        nowMs,
        nextExecutionMs: nextExecutionTimeMs,
        timestampsMs,
      })
    );
  }, [
    viewDomain,
    isInitialLoading,
    scrollBounds,
    nowMs,
    nextExecutionTimeMs,
    timestampsMs,
  ]);

  const oldestLoadedScheduleTimeMs = useMemo(
    () => getOldestLoadedScheduleTimeMs(workflowsQuery.data),
    [workflowsQuery.data]
  );

  const shouldFetchOlderWorkflows = useCallback(
    (domain: MetricsChartTimeDomain | null) => {
      if (
        domain == null ||
        !workflowsQuery.hasNextPage ||
        workflowsQuery.isFetchingNextPage
      ) {
        return false;
      }

      if (oldestLoadedScheduleTimeMs == null) {
        return true;
      }

      const viewSpanMs = domain.maxMs - domain.minMs;
      const fetchThresholdMs =
        domain.minMs + viewSpanMs * CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO;

      return oldestLoadedScheduleTimeMs > fetchThresholdMs;
    },
    [
      oldestLoadedScheduleTimeMs,
      workflowsQuery.hasNextPage,
      workflowsQuery.isFetchingNextPage,
    ]
  );

  useEffect(() => {
    if (!shouldFetchOlderWorkflows(viewDomain)) {
      return;
    }

    void workflowsQuery.fetchNextPage();
  }, [
    viewDomain,
    shouldFetchOlderWorkflows,
    workflowsQuery.fetchNextPage,
    workflowsQuery.data?.pages.length,
  ]);

  const shiftViewByClientDelta = useCallback(
    (deltaClientX: number, startViewDomain: MetricsChartTimeDomain) => {
      const chartWidth = chartWidthRef.current;

      if (chartWidth <= 0) {
        return;
      }

      const viewSpanMs = startViewDomain.maxMs - startViewDomain.minMs;
      const deltaMs = -(deltaClientX / chartWidth) * viewSpanMs;

      setViewDomain(
        shiftMetricsChartViewDomain({
          viewDomain: startViewDomain,
          deltaMs,
          bounds: panBounds,
        })
      );
    },
    [panBounds]
  );

  const handlePanStart = useCallback(
    (clientX: number) => {
      if (viewDomain == null) {
        return;
      }

      panStateRef.current = {
        startClientX: clientX,
        startViewDomain: viewDomain,
      };
      setIsPanning(true);
    },
    [viewDomain]
  );

  useEffect(() => {
    if (!isPanning) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const panState = panStateRef.current;

      if (!panState) {
        return;
      }

      shiftViewByClientDelta(
        event.clientX - panState.startClientX,
        panState.startViewDomain
      );
    };

    const handlePointerUp = () => {
      panStateRef.current = null;
      setIsPanning(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPanning, shiftViewByClientDelta]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (viewDomain == null) {
        return;
      }

      event.preventDefault();

      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const viewSpanMs = viewDomain.maxMs - viewDomain.minMs;
      const chartWidth = chartWidthRef.current || 1;
      const deltaMs = (horizontalDelta / chartWidth) * viewSpanMs;

      setViewDomain((currentViewDomain) => {
        if (currentViewDomain == null) {
          return currentViewDomain;
        }

        return shiftMetricsChartViewDomain({
          viewDomain: currentViewDomain,
          deltaMs,
          bounds: panBounds,
        });
      });
    },
    [panBounds, viewDomain]
  );

  const hasRenderableChartData =
    hasScheduleMetricsChartData(chartData) || describeQuery.isSuccess;

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
        {isInitialLoading ? <ScheduleDetailMetricsChartLoading /> : null}
        <ParentSize>
          {({ width = 0, height = 0 }) => {
            chartWidthRef.current = Math.max(width, 0);
            const chartWidth = Math.max(width, 0);
            const chartHeight = Math.max(height, 0);

            if (
              isInitialLoading ||
              !hasRenderableChartData ||
              chartWidth === 0 ||
              chartHeight === 0 ||
              viewDomain == null
            ) {
              if (isInitialLoading) {
                return null;
              }

              return (
                <styled.EmptyState role="status">
                  {CHART_EMPTY_STATE_MESSAGE}
                </styled.EmptyState>
              );
            }

            return (
              <styled.ChartCanvas
                $isPanning={isPanning}
                data-testid="schedule-metrics-chart-canvas"
                onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
                  if (event.button !== 0) {
                    return;
                  }

                  event.currentTarget.setPointerCapture(event.pointerId);
                  handlePanStart(event.clientX);
                }}
                onWheel={handleWheel}
              >
                <ScheduleMetricsChartSvg
                  width={chartWidth}
                  height={chartHeight}
                  chartData={chartData}
                  viewDomain={viewDomain}
                />
                {isFetchingMore ? (
                  <styled.FetchLoadingOverlay
                    role="status"
                    data-testid={CHART_FETCH_LOADING_TEST_ID}
                  >
                    Loading older runs…
                  </styled.FetchLoadingOverlay>
                ) : null}
              </styled.ChartCanvas>
            );
          }}
        </ParentSize>
      </styled.ChartRegion>
    </styled.Container>
  );
}
