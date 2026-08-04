import React from 'react';

import { useStyletron } from 'baseui';
import { Skeleton } from 'baseui/skeleton';
import { Spinner } from 'baseui/spinner';
import {
  MdAdjust,
  MdBlock,
  MdCheckCircleOutline,
  MdHistory,
  MdReportGmailerrorred,
} from 'react-icons/md';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import getChartGlyphColor from './helpers/get-chart-glyph-color';
import {
  CHART_GLYPH_MARKER_SIZE_PX,
  CHART_GLYPH_TEST_IDS,
} from './schedule-details-runs-chart-glyph.constants';
import { styled, overrides } from './schedule-details-runs-chart-glyph.styles';
import { type Props } from './schedule-details-runs-chart-glyph.types';

export default function ScheduleDetailsRunsChartGlyph({
  x,
  y,
  variant,
  runCount = 1,
  isBackfill = false,
  label,
  testId,
}: Props) {
  const [, theme] = useStyletron();
  const isGrouped = runCount > 1;
  const halfMarkerSizePx = CHART_GLYPH_MARKER_SIZE_PX / 2;
  const isPositioned = x != null && y != null;
  const color = getChartGlyphColor(theme, variant);
  const iconProps = {
    color,
    size: CHART_GLYPH_MARKER_SIZE_PX,
    'aria-hidden': true,
  } as const;

  let statusIcon: React.ReactNode;
  switch (variant) {
    case WORKFLOW_STATUSES.completed:
    case WORKFLOW_STATUSES.continuedAsNew:
      statusIcon = (
        <styled.Icon>
          <MdCheckCircleOutline {...iconProps} />
        </styled.Icon>
      );
      break;
    case WORKFLOW_STATUSES.failed:
    case WORKFLOW_STATUSES.timedOut:
      statusIcon = (
        <styled.Icon>
          <MdReportGmailerrorred {...iconProps} />
        </styled.Icon>
      );
      break;
    case WORKFLOW_STATUSES.running:
      statusIcon = (
        <Spinner $size={CHART_GLYPH_MARKER_SIZE_PX} $color={color} />
      );
      break;
    case WORKFLOW_STATUSES.canceled:
    case WORKFLOW_STATUSES.terminated:
      statusIcon = (
        <styled.Icon>
          <MdBlock {...iconProps} />
        </styled.Icon>
      );
      break;
    case 'skipped':
      statusIcon = <styled.Skipped />;
      break;
    case 'loading':
      statusIcon = (
        <Skeleton
          height={`${CHART_GLYPH_MARKER_SIZE_PX}px`}
          width={`${CHART_GLYPH_MARKER_SIZE_PX}px`}
          overrides={overrides.loadingSkeleton}
          animation
        />
      );
      break;
    case 'next':
      statusIcon = (
        <styled.Icon>
          <MdAdjust {...iconProps} />
        </styled.Icon>
      );
      break;
  }

  return (
    <styled.Marker
      role="img"
      aria-label={label}
      title={label}
      data-testid={testId}
      $positioned={isPositioned}
      style={
        isPositioned
          ? {
              transform: `translate(${x - halfMarkerSizePx}px, ${y - halfMarkerSizePx}px)`,
            }
          : undefined
      }
    >
      {isGrouped ? (
        <styled.GroupedMarker>
          <styled.GroupedMarkerBack $offset={8} $isNear={false} />
          <styled.GroupedMarkerBack $offset={4} $isNear />
          <styled.GroupedMarkerCount>{runCount}</styled.GroupedMarkerCount>
        </styled.GroupedMarker>
      ) : (
        statusIcon
      )}
      {isBackfill && !isGrouped && (
        <styled.BackfillBadge data-testid={CHART_GLYPH_TEST_IDS.backfillBadge}>
          <MdHistory
            color={theme.colors.contentSecondary}
            size={10}
            aria-hidden
          />
        </styled.BackfillBadge>
      )}
    </styled.Marker>
  );
}
