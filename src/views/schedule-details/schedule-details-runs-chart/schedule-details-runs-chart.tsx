'use client';
import React, { useEffect, useMemo } from 'react';

import { useParentSize } from '@visx/responsive';
import { Skeleton } from 'baseui/skeleton';
import { MdGpsFixed, MdZoomIn, MdZoomOut } from 'react-icons/md';

import Button from '@/components/button/button';
import useCurrentTimeMs from '@/hooks/use-current-time-ms/use-current-time-ms';
import useScheduleRunsChartData from '@/views/schedule-details/hooks/use-schedule-runs-chart-data/use-schedule-runs-chart-data';
import useScheduleRunsChartViewState from '@/views/schedule-details/hooks/use-schedule-runs-chart-view-state/use-schedule-runs-chart-view-state';

import hasScheduleRunsChartData from '../schedule-details-runs-chart-series/helpers/has-schedule-runs-chart-data';
import ScheduleDetailsRunsChartSeries from '../schedule-details-runs-chart-series/schedule-details-runs-chart-series';
import ScheduleDetailsRunsChartTimeline from '../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline';

import { getChartTimeWindowSpanMs } from './helpers/chart-view-state';
import createChartXScale from './helpers/create-chart-x-scale';
import filterChartSeriesDataToVisibleWindow from './helpers/filter-chart-series-data-to-visible-window';
import resolveChartPixelRange from './helpers/resolve-chart-pixel-range';
import resolveChartTimeWindow from './helpers/resolve-chart-time-window';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_HEIGHT_PX,
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

export default function ScheduleDetailsRunsChart({ params }: Props) {
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

  // The chart's current auto-fit window doubles as both the loaded-data
  // bounds and the initial zoom level. Sizing the initial zoom from the
  // schedule's cron cadence instead is a follow-up.
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
    canZoomIn,
    canZoomOut,
    initializeWindow,
    zoomIn,
    zoomOut,
  } = useScheduleRunsChartViewState({
    bounds: navigationBounds,
    nowMs,
    nextExecutionMs: chartData.nextExecutionTimeMs,
  });

  useEffect(() => {
    if (
      visibleWindow != null ||
      isLoading ||
      loadedTimeWindow == null ||
      navigationBounds == null
    ) {
      return;
    }

    // Zooming out is capped at the full navigable range, since there is no
    // cron-cadence-aware sizing yet to pick a tighter max span.
    initializeWindow(
      loadedTimeWindow,
      getChartTimeWindowSpanMs(navigationBounds)
    );
  }, [
    initializeWindow,
    isLoading,
    loadedTimeWindow,
    navigationBounds,
    visibleWindow,
  ]);

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
            disabled
            overrides={overrides.toolbarButton}
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
          <>
            <styled.ChartSvg width={width} height={CHART_HEIGHT_PX}>
              <ScheduleDetailsRunsChartTimeline
                width={width}
                height={CHART_HEIGHT_PX}
                xScale={xScale}
                nowMs={nowMs}
              />
            </styled.ChartSvg>
            <ScheduleDetailsRunsChartSeries
              xScale={xScale}
              data={visibleData}
              domain={params.domain}
              cluster={params.cluster}
            />
          </>
        )}
      </styled.ChartRegion>
    </styled.Container>
  );
}
