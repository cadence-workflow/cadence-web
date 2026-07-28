'use client';
import React from 'react';

import { MdGpsFixed, MdZoomIn, MdZoomOut } from 'react-icons/md';

import Button from '@/components/button/button';

import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_TOOLBAR_ICON_SIZE_PX,
} from './schedule-details-runs-chart.constants';
import { overrides, styled } from './schedule-details-runs-chart.styles';
import { type Props } from './schedule-details-runs-chart.types';

export default function ScheduleDetailsRunsChart(_props: Props) {
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
      <styled.ChartRegion role="region" aria-label={CHART_REGION_ARIA_LABEL}>
        <styled.EmptyState role="status">
          {CHART_EMPTY_STATE_MESSAGE}
        </styled.EmptyState>
      </styled.ChartRegion>
    </styled.Container>
  );
}
