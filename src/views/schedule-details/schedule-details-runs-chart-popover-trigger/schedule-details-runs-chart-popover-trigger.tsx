'use client';
import React from 'react';

import { StatefulPopover } from 'baseui/popover';

import {
  CHART_GLYPH_HIT_AREA_RADIUS_PX,
  CHART_RUN_POPOVER_ENTRY_DELAY_MS,
} from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';
import ScheduleDetailsRunsChartPopoverContent from '@/views/schedule-details/schedule-details-runs-chart-popover/schedule-details-runs-chart-popover-content';

import {
  overrides,
  styled,
} from './schedule-details-runs-chart-popover-trigger.styles';
import { type Props } from './schedule-details-runs-chart-popover-trigger.types';

export default function ScheduleDetailsRunsChartPopoverTrigger({
  x,
  y,
  entries,
  domain,
  cluster,
  ariaLabel,
  testId,
  children,
}: Props) {
  return (
    <styled.TriggerAnchor
      style={{
        transform: `translate(${x - CHART_GLYPH_HIT_AREA_RADIUS_PX}px, ${y - CHART_GLYPH_HIT_AREA_RADIUS_PX}px)`,
      }}
    >
      <StatefulPopover
        triggerType="hover"
        accessibilityType="tooltip"
        content={() => (
          <ScheduleDetailsRunsChartPopoverContent
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
        >
          {children}
        </styled.HitArea>
      </StatefulPopover>
    </styled.TriggerAnchor>
  );
}
