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
  CHART_EMPTY_STATE_MESSAGE,
  CHART_FETCH_LOADING_MESSAGE,
  CHART_FETCH_LOADING_SPINNER_SIZE_PX,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_FETCH_RETRY_ICON_SIZE_PX,
  CHART_FETCH_RETRY_LABEL,
  CHART_HEIGHT_PX,
  CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
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
  const newRunTimesMs = useNewChartTimesMs({
    timesMs: chartData.runs.map(({ scheduledTimeMs }) => scheduledTimeMs),
    isEnabled: !isLoading,
  });
  const newSkippedTimesMs = useNewChartTimesMs({
    timesMs: chartData.skippedExecutions.map(
      ({ scheduledTimeMs }) => scheduledTimeMs
    ),
    isEnabled: !isLoading,
  });
  const newNextTimesMs = useNewChartTimesMs({
    timesMs:
      chartData.nextExecutionTimeMs == null
        ? []
        : [chartData.nextExecutionTimeMs],
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
  // zoom can be chosen from how many runs actually fit on screen.
  useEffect(() => {
    if (
      visibleWindow != null ||
      isLoading ||
      navigationBounds == null ||
      width <= 0
    ) {
      return;
    }

    initializeWindow(
      resolveInitialChartTimeWindow({
        nowMs,
        chartWidthPx: width,
        nextExecutionMs: chartData.nextExecutionTimeMs,
        timestampsMs,
      })
    );
  }, [
    chartData.nextExecutionTimeMs,
    initializeWindow,
    isLoading,
    navigationBounds,
    nowMs,
    timestampsMs,
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

  const panByClientDelta = useCallback(
    (deltaClientX: number) => {
      if (width <= 0 || visibleWindow == null) {
        return false;
      }

      const viewSpanMs = visibleWindow.maxMs - visibleWindow.minMs;

      return panByMs(-(deltaClientX / width) * viewSpanMs);
    },
    [panByMs, visibleWindow, width]
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

  useEffect(() => {
    if (!isPanning) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const lastPanClientX = lastPanClientXRef.current;

      if (lastPanClientX == null) {
        return;
      }

      lastPanClientXRef.current = event.clientX;
      panByClientDelta(event.clientX - lastPanClientX);
    };

    const handlePointerUp = () => {
      lastPanClientXRef.current = null;
      setIsPanning(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPanning, panByClientDelta]);

  // Native listener so the gesture can stay scrollable at the chart edges:
  // React attaches `onWheel` passively, where `preventDefault` has no effect.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas == null || visibleWindow == null) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const viewSpanMs = visibleWindow.maxMs - visibleWindow.minMs;

      if (panByMs((horizontalDelta / (width || 1)) * viewSpanMs)) {
        event.preventDefault();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [panByMs, visibleWindow, width]);

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
        <styled.Toolbar role="toolbar" aria-label={CHART_TOOLBAR_ARIA_LABEL}>
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
        aria-label={CHART_REGION_ARIA_LABEL}
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
            {CHART_EMPTY_STATE_MESSAGE}
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
                    ? CHART_FETCH_RETRY_LABEL
                    : CHART_FETCH_LOADING_MESSAGE
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
                    aria-label={CHART_FETCH_RETRY_LABEL}
                    overrides={overrides.toolbarButton}
                    onClick={fetchNextPage}
                  >
                    <styled.ControlContent>
                      <MdReportGmailerrorred
                        aria-hidden
                        size={CHART_FETCH_RETRY_ICON_SIZE_PX}
                      />
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
              scheduleId={params.scheduleId}
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
