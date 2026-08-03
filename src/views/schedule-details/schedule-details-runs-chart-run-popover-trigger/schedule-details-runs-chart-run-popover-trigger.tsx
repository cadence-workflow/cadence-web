'use client';
import React from 'react';

import { StatefulPopover } from 'baseui/popover';

import { CHART_RUN_POPOVER_ENTRY_DELAY_MS } from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';
import ScheduleDetailsRunsChartRunPopover from '@/views/schedule-details/schedule-details-runs-chart-run-popover/schedule-details-runs-chart-run-popover';

import {
  overrides,
  styled,
} from './schedule-details-runs-chart-run-popover-trigger.styles';
import { type Props } from './schedule-details-runs-chart-run-popover-trigger.types';

export default function ScheduleDetailsRunsChartRunPopoverTrigger({
  x,
  y,
  entries,
  domain,
  cluster,
  ariaLabel,
  testId,
}: Props) {
  return (
    <styled.TriggerAnchor $x={x} $y={y}>
      <StatefulPopover
        triggerType="hover"
        accessibilityType="tooltip"
        content={() => (
          <ScheduleDetailsRunsChartRunPopover
            entries={entries}
            domain={domain}
            cluster={cluster}
          />
        )}
        placement="top"
        overrides={overrides.popover}
        onMouseEnterDelay={CHART_RUN_POPOVER_ENTRY_DELAY_MS}
        popoverMargin={0}
      >
        <styled.HitArea
          type="button"
          aria-label={ariaLabel}
          data-testid={testId}
        />
      </StatefulPopover>
    </styled.TriggerAnchor>
  );
}
