'use client';
import React from 'react';

import { StatefulPopover } from 'baseui/popover';

import ScheduleDetailMetricsChartRunPopover from '../schedule-detail-metrics-chart-run-popover/schedule-detail-metrics-chart-run-popover';
import { CHART_RUN_POPOVER_ENTRY_DELAY_MS } from '../schedule-detail-metrics-chart.constants';

import { overrides, styled } from './schedule-detail-metrics-chart-glyph.styles';
import { type Props } from './schedule-detail-metrics-chart-glyph.types';

export default function ScheduleDetailMetricsChartGlyph({
  x,
  y,
  runs,
  domain,
  cluster,
  variant,
  testId,
}: Props) {
  const runCount = runs.length;
  const ariaLabel =
    runCount === 1
      ? `${variant === 'missed' ? 'Missed' : 'Successful'} schedule run ${runs[0].runId}`
      : `${runCount} ${variant === 'missed' ? 'missed' : 'successful'} schedule runs at ${new Date(runs[0].scheduledTimeMs).toISOString()}`;

  return (
    <StatefulPopover
      triggerType="hover"
      accessibilityType="tooltip"
      content={() => (
        <ScheduleDetailMetricsChartRunPopover
          runs={runs}
          domain={domain}
          cluster={cluster}
        />
      )}
      placement="top"
      overrides={overrides.popover}
      onMouseEnterDelay={CHART_RUN_POPOVER_ENTRY_DELAY_MS}
    >
      <styled.HitArea
        type="button"
        $x={x}
        $y={y}
        aria-label={ariaLabel}
        data-testid={testId}
      />
    </StatefulPopover>
  );
}
