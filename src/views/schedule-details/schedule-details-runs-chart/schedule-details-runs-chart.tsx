'use client';
import React, { useMemo } from 'react';

import { useParentSize } from '@visx/responsive';
import { MdGpsFixed, MdZoomIn, MdZoomOut } from 'react-icons/md';

import Button from '@/components/button/button';

import createChartXScale from './helpers/create-chart-x-scale';
import resolveChartPixelRange from './helpers/resolve-chart-pixel-range';
import resolveChartTimeWindow from './helpers/resolve-chart-time-window';
import useCurrentTimeMs from './hooks/use-current-time-ms';
import ScheduleDetailsRunsChartTimeline from './schedule-details-runs-chart-timeline';
import {
  CHART_HEIGHT_PX,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_TOOLBAR_ICON_SIZE_PX,
} from './schedule-details-runs-chart.constants';
import { overrides, styled } from './schedule-details-runs-chart.styles';
import { type Props } from './schedule-details-runs-chart.types';

export default function ScheduleDetailsRunsChart(_props: Props) {
  const nowMs = useCurrentTimeMs();
  const { parentRef, width } = useParentSize({
    initialSize: { width: 0, height: CHART_HEIGHT_PX },
  });

  const xScale = useMemo(() => {
    const timeWindow = resolveChartTimeWindow({ timestampsMs: [], nowMs });
    const range = resolveChartPixelRange({ widthPx: width });

    if (timeWindow === null || range === null) {
      return null;
    }

    return createChartXScale({ timeWindow, range });
  }, [nowMs, width]);

  return (
    <styled.Container>
      <styled.Header>
        <styled.Toolbar role="toolbar" aria-label={CHART_TOOLBAR_ARIA_LABEL}>
          <Button
            size="mini"
            kind="tertiary"
            disabled
            overrides={overrides.toolbarButton}
          >
            <styled.ControlContent>
              <MdZoomOut size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.zoomOut}
            </styled.ControlContent>
          </Button>
          <Button
            size="mini"
            kind="tertiary"
            disabled
            overrides={overrides.toolbarButton}
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
        {xScale !== null && (
          <styled.ChartSvg width={width} height={CHART_HEIGHT_PX}>
            <ScheduleDetailsRunsChartTimeline
              width={width}
              height={CHART_HEIGHT_PX}
              xScale={xScale}
              nowMs={nowMs}
            />
          </styled.ChartSvg>
        )}
      </styled.ChartRegion>
    </styled.Container>
  );
}
