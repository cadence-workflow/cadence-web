'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ParentSize } from '@visx/responsive';
import { MdFitScreen, MdGpsFixed, MdZoomIn, MdZoomOut } from 'react-icons/md';

import Button from '@/components/button/button';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useListWorkflowsForSchedule from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';

import describeScheduleToNextExecutionMs from './helpers/describe-schedule-to-next-execution';
import hasScheduleMetricsChartData from './helpers/has-schedule-metrics-chart-data';
import resolveInitialMetricsChartViewDomain from './helpers/resolve-initial-metrics-chart-view-domain';
import shiftMetricsChartViewDomain from './helpers/shift-metrics-chart-view-domain';
import workflowsForScheduleToChartPoints, {
  getOldestLoadedScheduleTimeMs,
} from './helpers/workflows-for-schedule-to-chart-points';
import ScheduleDetailMetricsChartGlyph from './schedule-detail-metrics-chart-glyph/schedule-detail-metrics-chart-glyph';
import { styled as glyphStyled } from './schedule-detail-metrics-chart-glyph/schedule-detail-metrics-chart-glyph.styles';
import ScheduleDetailMetricsChartLoading from './schedule-detail-metrics-chart-loading';
import {
  createMetricsChartXScale,
  resolveMetricsChartPixelRange,
  resolveMetricsChartTimeDomain,
} from './schedule-detail-metrics-chart-scales';
import ScheduleDetailMetricsChartSeries from './schedule-detail-metrics-chart-series';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_GLYPH_TEST_IDS,
  CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_MISSED_Y_RATIO,
  CHART_SERIES_SUCCESS_Y_RATIO,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_WORKFLOWS_PAGE_SIZE,
} from './schedule-detail-metrics-chart.constants';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import {
  type MetricsChartTimeDomain,
  type Props,
} from './schedule-detail-metrics-chart.types';

type PanState = {
  startClientX: number;
  startViewDomain: MetricsChartTimeDomain;
};

export default function ScheduleDetailMetricsChart({ params }: Props) {
  const { domain, cluster, scheduleId } = params;
  const { theme } = useStyletronClasses({});
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
      ...chartData.missedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
    ],
    [chartData]
  );

  const nowMs = Date.now();

  const isInitialLoading = describeQuery.isLoading || workflowsQuery.isLoading;
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
      workflowsQuery.data,
      workflowsQuery.hasNextPage,
      workflowsQuery.isFetchingNextPage,
      workflowsQuery.isLoading,
      workflowsQuery.isSuccess,
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
    [scrollBounds]
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
    [scrollBounds, viewDomain]
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

            const pixelRange = resolveMetricsChartPixelRange({
              widthPx: chartWidth,
            });
            const xScale =
              pixelRange != null
                ? createMetricsChartXScale({
                    domain: viewDomain,
                    range: pixelRange,
                  })
                : null;

            if (!xScale) {
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
                onPointerDown={(event) => {
                  if (event.button !== 0) {
                    return;
                  }

                  event.currentTarget.setPointerCapture(event.pointerId);
                  handlePanStart(event.clientX);
                }}
                onWheel={handleWheel}
              >
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
                {isFetchingMore ? (
                  <styled.FetchLoadingOverlay
                    role="status"
                    data-testid={CHART_FETCH_LOADING_TEST_ID}
                  >
                    Loading older runs…
                  </styled.FetchLoadingOverlay>
                ) : null}
                <glyphStyled.Overlay>
                  {chartData.successfulRuns.map(({ scheduledTimeMs, runs }) => (
                    <ScheduleDetailMetricsChartGlyph
                      key={`successful-trigger-${scheduledTimeMs}`}
                      x={xScale(scheduledTimeMs)}
                      y={chartHeight * CHART_SERIES_SUCCESS_Y_RATIO}
                      runs={runs}
                      domain={params.domain}
                      cluster={params.cluster}
                      variant="successful"
                      testId={CHART_GLYPH_TEST_IDS.successfulRunTrigger}
                    />
                  ))}
                  {chartData.missedExecutions.map(
                    ({ scheduledTimeMs, runs }) => (
                      <ScheduleDetailMetricsChartGlyph
                        key={`missed-trigger-${scheduledTimeMs}`}
                        x={xScale(scheduledTimeMs)}
                        y={chartHeight * CHART_SERIES_MISSED_Y_RATIO}
                        runs={runs}
                        domain={params.domain}
                        cluster={params.cluster}
                        variant="missed"
                        testId={CHART_GLYPH_TEST_IDS.missedExecutionTrigger}
                      />
                    )
                  )}
                </glyphStyled.Overlay>
              </styled.ChartCanvas>
            );
          }}
        </ParentSize>
      </styled.ChartRegion>
    </styled.Container>
  );
}
