'use client';
import React from 'react';

import { Skeleton } from 'baseui/skeleton';

import { CHART_LOADING_SKELETON_TEST_ID } from './schedule-detail-metrics-chart.constants';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';

export default function ScheduleDetailMetricsChartLoading() {
  return (
    <styled.LoadingOverlay
      role="status"
      aria-label="Loading schedule metrics chart"
      data-testid={CHART_LOADING_SKELETON_TEST_ID}
    >
      <Skeleton
        animation
        rows={0}
        width="100%"
        height="100%"
        overrides={overrides.loadingSkeleton}
      />
    </styled.LoadingOverlay>
  );
}
