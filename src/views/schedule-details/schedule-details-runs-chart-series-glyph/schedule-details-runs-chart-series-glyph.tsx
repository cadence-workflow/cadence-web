import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import {
  MdAdjust,
  MdBlock,
  MdCheckCircleOutline,
  MdHistory,
  MdReportGmailerrorred,
} from 'react-icons/md';

import getChartSeriesGlyphColor from './helpers/get-chart-series-glyph-color';
import {
  CHART_GLYPH_BACKFILL_BADGE_ICON_SIZE_PX,
  CHART_GLYPH_FAILED_ICON_SCALE,
  CHART_GLYPH_GROUPED_CARD_OFFSETS_PX,
  CHART_GLYPH_MARKER_SIZE_PX,
  CHART_GLYPH_TEST_IDS,
} from './schedule-details-runs-chart-series-glyph.constants';
import { styled } from './schedule-details-runs-chart-series-glyph.styles';
import { type Props } from './schedule-details-runs-chart-series-glyph.types';

export default function ScheduleDetailsRunsChartSeriesGlyph({
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
  const color = getChartSeriesGlyphColor(theme, variant);
  const iconProps = {
    color,
    size: CHART_GLYPH_MARKER_SIZE_PX,
    'aria-hidden': true,
  } as const;

  let statusIcon: React.ReactNode;
  switch (variant) {
    case 'completed':
      statusIcon = <MdCheckCircleOutline {...iconProps} />;
      break;
    case 'failed':
      statusIcon = (
        <styled.Icon $scale={CHART_GLYPH_FAILED_ICON_SCALE}>
          <MdReportGmailerrorred {...iconProps} />
        </styled.Icon>
      );
      break;
    case 'running':
      statusIcon = (
        <Spinner $size={CHART_GLYPH_MARKER_SIZE_PX} $color={color} />
      );
      break;
    case 'canceled':
      statusIcon = <MdBlock {...iconProps} />;
      break;
    case 'skipped':
      statusIcon = <styled.Skipped />;
      break;
    case 'next':
      statusIcon = <MdAdjust {...iconProps} />;
      break;
  }

  return (
    <styled.Marker
      role="img"
      aria-label={label}
      title={label}
      data-testid={testId}
      style={{
        transform: `translate(${x - halfMarkerSizePx}px, ${y - halfMarkerSizePx}px)`,
      }}
    >
      {isGrouped ? (
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
        statusIcon
      )}
      {isBackfill && !isGrouped && (
        <styled.BackfillBadge data-testid={CHART_GLYPH_TEST_IDS.backfillBadge}>
          <MdHistory
            color={theme.colors.contentSecondary}
            size={CHART_GLYPH_BACKFILL_BADGE_ICON_SIZE_PX}
            aria-hidden
          />
        </styled.BackfillBadge>
      )}
    </styled.Marker>
  );
}
