'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useParentSize } from '@visx/responsive';
import { Skeleton } from 'baseui/skeleton';
import { Spinner } from 'baseui/spinner';
import {
  MdGpsFixed,
  MdReportGmailerrorred,
  MdZoomIn,
  MdZoomOut,
} from 'react-icons/md';

import Button from '@/components/button/button';
import useCurrentTimeMs from '@/hooks/use-current-time-ms/use-current-time-ms';
import useScheduleRunsChartData from '@/views/schedule-details/hooks/use-schedule-runs-chart-data/use-schedule-runs-chart-data';
import useScheduleRunsChartViewState from '@/views/schedule-details/hooks/use-schedule-runs-chart-view-state/use-schedule-runs-chart-view-state';
import ScheduleDetailsRunsChartLegendIcon from '@/views/schedule-details/schedule-details-runs-chart-legend-icon/schedule-details-runs-chart-legend-icon';

import hasScheduleRunsChartData from '../schedule-details-runs-chart-series/helpers/has-schedule-runs-chart-data';
import ScheduleDetailsRunsChartSeries from '../schedule-details-runs-chart-series/schedule-details-runs-chart-series';
import ScheduleDetailsRunsChartTimeline from '../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline';

import createChartXScale from './helpers/create-chart-x-scale';
import filterChartSeriesDataToVisibleWindow from './helpers/filter-chart-series-data-to-visible-window';
import resolveChartPixelRange from './helpers/resolve-chart-pixel-range';
import resolveChartTimeWindow from './helpers/resolve-chart-time-window';
import resolveInitialChartTimeWindow from './helpers/resolve-initial-chart-time-window';
import {
  CHART_CANVAS_TEST_ID,
  CHART_FETCH_LOADING_SPINNER_SIZE_PX,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_FETCH_RETRY_ICON_SIZE_PX,
  CHART_HEIGHT_PX,
  CHART_LEGEND_ICON_SIZE_PX,
  CHART_LEGEND_ITEMS,
  CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO,
  CHART_SUMMARY_TEST_ID,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_TOOLBAR_ICON_SIZE_PX,
  CURRENT_TIME_UPDATE_INTERVAL_MS,
} from './schedule-details-runs-chart.constants';
import { overrides, styled } from './schedule-details-runs-chart.styles';
import {
  type ChartTimeWindow,
  type Props,
} from './schedule-details-runs-chart.types';
import useNewChartTimesMs from './use-new-chart-times-ms';

export default function ScheduleDetailsRunsChart({ params }: Props) {
  const [isPanning, setIsPanning] = useState(false);
  const lastPanClientXRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const nowMs = useCurrentTimeMs({
    intervalMs: CURRENT_TIME_UPDATE_INTERVAL_MS,
  });
  const { parentRef, width } = useParentSize({
    initialSize: { width: 0, height: CHART_HEIGHT_PX },
  });

  const {
    data: chartData,
    cronExpression,
    isLoading,
    timelineStartMs,
    oldestLoadedScheduleTimeMs,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useScheduleRunsChartData({
    domain: params.domain,
    cluster: params.cluster,
    scheduleId: params.scheduleId,
    nowMs,
  });
  const hasChartData = hasScheduleRunsChartData(chartData);

  const timestampsMs = useMemo(
    () => [
      ...chartData.runs.map(({ scheduledTimeMs }) => scheduledTimeMs),
      ...chartData.skippedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
      ...chartData.unconfirmedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
    ],
    [chartData]
  );
  const { runTimesMs, skippedTimesMs, nextTimesMs } = useMemo(
    () => ({
      runTimesMs: chartData.runs.map(({ scheduledTimeMs }) => scheduledTimeMs),
      skippedTimesMs: chartData.skippedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
      nextTimesMs:
        chartData.nextExecutionTimeMs == null
          ? []
          : [chartData.nextExecutionTimeMs],
    }),
    [chartData]
  );
  const newRunTimesMs = useNewChartTimesMs({
    timesMs: runTimesMs,
    isEnabled: !isLoading,
  });
  const newSkippedTimesMs = useNewChartTimesMs({
    timesMs: skippedTimesMs,
    isEnabled: !isLoading,
  });
  const newNextTimesMs = useNewChartTimesMs({
    timesMs: nextTimesMs,
    isEnabled: !isLoading,
  });

  const loadedTimeWindow = useMemo(
    () =>
      resolveChartTimeWindow({
        timestampsMs,
        nowMs,
        nextExecutionMs: chartData.nextExecutionTimeMs,
        minimumTimeMs: timelineStartMs,
      }),
    [chartData.nextExecutionTimeMs, nowMs, timelineStartMs, timestampsMs]
  );

  const navigationBounds = useMemo<ChartTimeWindow | null>(
    () =>
      loadedTimeWindow
        ? {
            minMs: Math.min(
              timelineStartMs ?? loadedTimeWindow.minMs,
              loadedTimeWindow.minMs
            ),
            maxMs: loadedTimeWindow.maxMs,
          }
        : null,
    [loadedTimeWindow, timelineStartMs]
  );

  const {
    visibleWindow,
    isFollowing,
    canZoomIn,
    canZoomOut,
    canPan,
    initializeWindow,
    zoomIn,
    zoomOut,
    goToNow,
    panByMs,
  } = useScheduleRunsChartViewState({
    bounds: navigationBounds,
    nowMs,
    nextExecutionMs: chartData.nextExecutionTimeMs,
  });

  // Initialization waits for the first non-zero measurement, so the starting
  // zoom can be sized from the cron cadence and drawable chart width.
  useEffect(() => {
    if (
      visibleWindow != null ||
      isLoading ||
      navigationBounds == null ||
      width <= 0
    ) {
      return;
    }

    const { window: initialWindow, maxSpanMs } = resolveInitialChartTimeWindow({
      nowMs,
      chartWidthPx: width,
      cronExpression,
      nextExecutionMs: chartData.nextExecutionTimeMs,
    });

    initializeWindow(initialWindow, maxSpanMs);
  }, [
    chartData.nextExecutionTimeMs,
    cronExpression,
    initializeWindow,
    isLoading,
    navigationBounds,
    nowMs,
    visibleWindow,
    width,
  ]);

  const shouldFetchOlderRuns = useCallback(
    (window: ChartTimeWindow | null) => {
      if (
        window == null ||
        !hasNextPage ||
        isFetchingNextPage ||
        isFetchNextPageError
      ) {
        return false;
      }

      if (oldestLoadedScheduleTimeMs == null) {
        return true;
      }

      const viewSpanMs = window.maxMs - window.minMs;
      const fetchThresholdMs =
        window.minMs + viewSpanMs * CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO;

      return oldestLoadedScheduleTimeMs > fetchThresholdMs;
    },
    [
      hasNextPage,
      isFetchNextPageError,
      isFetchingNextPage,
      oldestLoadedScheduleTimeMs,
    ]
  );

  useEffect(() => {
    if (!shouldFetchOlderRuns(visibleWindow)) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, shouldFetchOlderRuns, visibleWindow]);

  // Read from a ref rather than closing over `visibleWindow` directly, so
  // this stays stable while following/panning update the window every tick
  // instead of tearing down and re-registering the pointermove/wheel
  // listeners below on every one of those renders.
  const visibleWindowRef = useRef(visibleWindow);
  useEffect(() => {
    visibleWindowRef.current = visibleWindow;
  }, [visibleWindow]);

  const panByClientDelta = useCallback(
    (deltaClientX: number) => {
      const currentVisibleWindow = visibleWindowRef.current;

      if (width <= 0 || currentVisibleWindow == null) {
        return false;
      }

      const viewSpanMs =
        currentVisibleWindow.maxMs - currentVisibleWindow.minMs;

      return panByMs(-(deltaClientX / width) * viewSpanMs);
    },
    [panByMs, width]
  );

  const handlePanStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || visibleWindow == null || !canPan) {
        return;
      }

      // Keeps the drag from selecting the timeline labels underneath.
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      lastPanClientXRef.current = event.clientX;
      setIsPanning(true);
    },
    [canPan, visibleWindow]
  );

  // Coalesces pointermove into one pan per animation frame: a drag can fire
  // far more move events than the browser paints, and each one otherwise
  // triggers its own re-render and visible-window re-filter.
  useEffect(() => {
    if (!isPanning) {
      return;
    }

    let pendingDeltaClientX = 0;
    let animationFrameId: number | null = null;

    const flushPendingDelta = () => {
      animationFrameId = null;

      if (pendingDeltaClientX === 0) {
        return;
      }

      const deltaClientX = pendingDeltaClientX;
      pendingDeltaClientX = 0;
      panByClientDelta(deltaClientX);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const lastPanClientX = lastPanClientXRef.current;

      if (lastPanClientX == null) {
        return;
      }

      lastPanClientXRef.current = event.clientX;
      pendingDeltaClientX += event.clientX - lastPanClientX;
      animationFrameId ??= window.requestAnimationFrame(flushPendingDelta);
    };

    const handlePointerUp = () => {
      lastPanClientXRef.current = null;
      setIsPanning(false);

      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
        flushPendingDelta();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPanning, panByClientDelta]);

  const hasVisibleWindow = visibleWindow != null;

  // Native listener so the gesture can stay scrollable at the chart edges:
  // React attaches `onWheel` passively, where `preventDefault` has no effect.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas == null || !hasVisibleWindow) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const isHorizontalSwipe = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const horizontalDelta = isHorizontalSwipe ? event.deltaX : event.deltaY;

      // Scrolling forward (positive delta) should reveal later times, the
      // opposite of a drag by the same client-space delta.
      const panned = panByClientDelta(-horizontalDelta);

      // Claim horizontal trackpad swipes over the whole pannable chart, not
      // just the ones that actually moved the window -- otherwise a swipe
      // that hits the bounds falls through un-prevented and the browser
      // reads it as a back/forward navigation gesture.
      if (panned || (canPan && isHorizontalSwipe)) {
        event.preventDefault();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [canPan, hasVisibleWindow, panByClientDelta]);

  const showFetchMoreError = isFetchNextPageError && !isFetchingNextPage;
  const toolbarEnabled = hasChartData && visibleWindow != null && !isLoading;

  const xScale = useMemo(() => {
    const range = resolveChartPixelRange({ widthPx: width });

    if (range === null || visibleWindow === null) {
      return null;
    }

    return createChartXScale({ timeWindow: visibleWindow, range });
  }, [visibleWindow, width]);

  const visibleData = useMemo(
    () => filterChartSeriesDataToVisibleWindow(chartData, visibleWindow),
    [chartData, visibleWindow]
  );

  const showLoadingOverlay = isLoading;
  const showEmptyState = !isLoading && (xScale === null || !hasChartData);
  const showChart = !isLoading && xScale !== null && hasChartData;

  return (
    <styled.Container>
      <styled.Header>
        <styled.Summary data-testid={CHART_SUMMARY_TEST_ID}>
          <styled.SummaryTitle>Runs:</styled.SummaryTitle>
          {CHART_LEGEND_ITEMS.map(({ variant, label }) => (
            <styled.SummaryItem key={variant}>
              <ScheduleDetailsRunsChartLegendIcon
                variant={variant}
                size={CHART_LEGEND_ICON_SIZE_PX}
              />
              {label}
            </styled.SummaryItem>
          ))}
        </styled.Summary>
        <styled.Toolbar role="toolbar" aria-label="Chart controls">
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || !canZoomOut}
            aria-disabled={!toolbarEnabled || !canZoomOut}
            overrides={overrides.toolbarButton}
            onClick={zoomOut}
          >
            <styled.ControlContent>
              <MdZoomOut size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.zoomOut}
            </styled.ControlContent>
          </Button>
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || !canZoomIn}
            aria-disabled={!toolbarEnabled || !canZoomIn}
            overrides={overrides.toolbarButton}
            onClick={zoomIn}
          >
            <styled.ControlContent>
              <MdZoomIn size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.zoomIn}
            </styled.ControlContent>
          </Button>
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || isFollowing}
            aria-disabled={!toolbarEnabled || isFollowing}
            overrides={overrides.toolbarButton}
            onClick={goToNow}
          >
            <styled.ControlContent>
              <MdGpsFixed size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.now}
            </styled.ControlContent>
          </Button>
        </styled.Toolbar>
      </styled.Header>
      <styled.ChartRegion
        ref={parentRef}
        role="region"
        aria-label="Schedule runs chart"
      >
        {showLoadingOverlay && (
          <Skeleton
            animation
            rows={0}
            width="100%"
            height="100%"
            overrides={overrides.loadingSkeleton}
          />
        )}
        {showEmptyState && (
          <styled.EmptyState role="status">
            No chart data available yet
          </styled.EmptyState>
        )}
        {showChart && (
          <styled.ChartCanvas
            ref={canvasRef}
            $isPanning={isPanning}
            $canPan={canPan}
            data-testid={CHART_CANVAS_TEST_ID}
            onPointerDown={handlePanStart}
          >
            <styled.ChartSvg width={width} height={CHART_HEIGHT_PX}>
              <ScheduleDetailsRunsChartTimeline
                width={width}
                height={CHART_HEIGHT_PX}
                xScale={xScale}
                nowMs={nowMs}
              />
            </styled.ChartSvg>
            {(isFetchingNextPage || showFetchMoreError) && (
              <styled.FetchLoadingContainer
                $isError={showFetchMoreError}
                role={showFetchMoreError ? 'alert' : 'status'}
                aria-label={
                  showFetchMoreError
                    ? 'Retry loading older runs'
                    : 'Loading older runs…'
                }
                data-testid={CHART_FETCH_LOADING_TEST_ID}
                onPointerDown={(event: React.PointerEvent<HTMLDivElement>) =>
                  event.stopPropagation()
                }
              >
                {showFetchMoreError ? (
                  <Button
                    size="mini"
                    kind="tertiary"
                    aria-label="Retry loading older runs"
                    overrides={overrides.toolbarButton}
                    onClick={fetchNextPage}
                  >
                    <styled.ControlContent>
                      <styled.FetchRetryIcon>
                        <MdReportGmailerrorred
                          aria-hidden
                          size={CHART_FETCH_RETRY_ICON_SIZE_PX}
                        />
                      </styled.FetchRetryIcon>
                    </styled.ControlContent>
                  </Button>
                ) : (
                  <Spinner $size={CHART_FETCH_LOADING_SPINNER_SIZE_PX} />
                )}
              </styled.FetchLoadingContainer>
            )}
            <ScheduleDetailsRunsChartSeries
              xScale={xScale}
              data={visibleData}
              domain={params.domain}
              cluster={params.cluster}
              newTimesMs={{
                runs: newRunTimesMs,
                skipped: newSkippedTimesMs,
                next: newNextTimesMs,
              }}
            />
          </styled.ChartCanvas>
        )}
      </styled.ChartRegion>
    </styled.Container>
  );
}
