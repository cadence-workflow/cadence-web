'use client';
import React from 'react';

import { StatefulPopover } from 'baseui/popover';

import formatDate from '@/utils/data-formatters/format-date';

import {
  overrides,
  styled,
} from './schedule-detail-metrics-chart-glyph.styles';
import { type Props } from './schedule-detail-metrics-chart-glyph.types';
import ScheduleDetailMetricsChartRunPopover from './schedule-detail-metrics-chart-run-popover';
import ScheduleDetailMetricsChartStatusIcon from './schedule-detail-metrics-chart-status-icon';
import {
  CHART_GLYPH_BACKFILL_BADGE_SIZE_PX,
  CHART_GLYPH_GROUPED_CARD_OFFSETS_PX,
  CHART_GLYPH_HIT_AREA_RADIUS_PX,
  CHART_GLYPH_MARKER_SIZE_PX,
  CHART_RUN_POPOVER_ENTRY_DELAY_MS,
} from './schedule-detail-metrics-chart.constants';

export default function ScheduleDetailMetricsChartGlyph({
  x,
  y,
  runs,
  scheduledTimeMs,
  domain,
  cluster,
  scheduleId,
  variant,
  isNew = false,
  testId,
}: Props) {
  const runCount = runs.length;
  const isBackfill = runs.some((run) => run.backfillId != null);
  const executionTimeMs = scheduledTimeMs ?? runs[0]?.scheduledTimeMs;
  const scheduledRunLabel = variant === 'next' ? 'Next run' : 'Skipped run';
  const ariaLabel =
    runCount === 0
      ? `${scheduledRunLabel} at ${new Date(
          executionTimeMs ?? 0
        ).toISOString()}`
      : runCount === 1
        ? `Schedule run ${runs[0].runId}`
        : `${runCount} schedule runs at ${new Date(runs[0].scheduledTimeMs).toISOString()}`;
  const marker = (
    <styled.MarkerButton
      type="button"
      $variant={variant}
      style={{
        transform: `translate(${x - CHART_GLYPH_HIT_AREA_RADIUS_PX}px, ${y - CHART_GLYPH_HIT_AREA_RADIUS_PX}px)`,
      }}
      aria-label={ariaLabel}
      data-testid={testId}
      data-chart-x={x}
      data-status-variant={variant}
      data-is-backfill={isBackfill || undefined}
    >
      <styled.StatusMarker $isNew={isNew}>
        {variant === 'grouped' ? (
          <styled.GroupedMarker>
            <styled.GroupedMarkerBack
              $offset={CHART_GLYPH_GROUPED_CARD_OFFSETS_PX.far}
              $isNear={false}
            />
            <styled.GroupedMarkerBack
              $offset={CHART_GLYPH_GROUPED_CARD_OFFSETS_PX.near}
              $isNear
            />
            <styled.GroupedMarkerCount>{runCount}</styled.GroupedMarkerCount>
          </styled.GroupedMarker>
        ) : (
          <ScheduleDetailMetricsChartStatusIcon
            variant={variant}
            size={CHART_GLYPH_MARKER_SIZE_PX}
          />
        )}
        {isBackfill && variant !== 'grouped' && (
          <styled.BackfillIndicator>
            <ScheduleDetailMetricsChartStatusIcon
              variant="backfill"
              size={CHART_GLYPH_BACKFILL_BADGE_SIZE_PX}
            />
          </styled.BackfillIndicator>
        )}
      </styled.StatusMarker>
    </styled.MarkerButton>
  );

  return (
    <StatefulPopover
      triggerType="hover"
      accessibilityType="tooltip"
      content={() =>
        runCount === 0 ? (
          <>
            <strong>{scheduledRunLabel}:</strong>{' '}
            {formatDate(executionTimeMs ?? 0)}
          </>
        ) : (
          <ScheduleDetailMetricsChartRunPopover
            runs={runs}
            domain={domain}
            cluster={cluster}
            scheduleId={scheduleId}
          />
        )
      }
      placement="top"
      overrides={overrides.popover}
      onMouseEnterDelay={CHART_RUN_POPOVER_ENTRY_DELAY_MS}
    >
      {marker}
    </StatefulPopover>
  );
}
