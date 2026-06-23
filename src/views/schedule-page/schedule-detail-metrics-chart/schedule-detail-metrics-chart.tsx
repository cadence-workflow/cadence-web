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

import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from './schedule-detail-metrics-chart.constants';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import { type Props } from './schedule-detail-metrics-chart.types';

export default function ScheduleDetailMetricsChart(_props: Props) {
  const hasChartData = false;

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
          {() =>
            hasChartData ? (
              <styled.ChartCanvas data-testid="schedule-metrics-chart-canvas" />
            ) : (
              <styled.EmptyState role="status">
                {CHART_EMPTY_STATE_MESSAGE}
              </styled.EmptyState>
            )
          }
        </ParentSize>
      </styled.ChartRegion>
    </styled.Container>
  );
}
