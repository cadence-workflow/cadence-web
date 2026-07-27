import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

import { type ScheduleMetricsChartGlyphVariant } from './schedule-detail-metrics-chart-series.types';
import {
  CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX,
  CHART_GLYPH_BACKFILL_BADGE_PADDING_PX,
  CHART_GLYPH_HIT_AREA_RADIUS_PX,
  CHART_GLYPH_MARKER_SIZE_PX,
} from './schedule-detail-metrics-chart.constants';

export const styled = {
  MarkerButton: createStyled<
    'button',
    {
      $x: number;
      $y: number;
      $variant: ScheduleMetricsChartGlyphVariant;
    }
  >('button', ({ $theme, $x, $y, $variant }) => ({
    position: 'absolute',
    left: `${$x - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
    top: `${$y - CHART_GLYPH_HIT_AREA_RADIUS_PX}px`,
    width: `${CHART_GLYPH_HIT_AREA_RADIUS_PX * 2}px`,
    height: `${CHART_GLYPH_HIT_AREA_RADIUS_PX * 2}px`,
    padding: 0,
    border: 'none',
    backgroundColor:
      $variant === 'grouped' ? $theme.colors.backgroundPrimary : 'transparent',
    cursor: 'pointer',
    pointerEvents: 'auto',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':focus-visible': {
      outline: `2px solid ${$theme.colors.borderAccent}`,
      outlineOffset: '1px',
    },
  })),
  GroupedMarker: createStyled('span', () => ({
    position: 'relative',
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
  })),
  StatusMarker: createStyled('span', () => ({
    position: 'relative',
    display: 'flex',
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
  })),
  BackfillIndicator: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: `-${CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX}px`,
    right: `-${CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX}px`,
    zIndex: 3,
    display: 'flex',
    padding: `${CHART_GLYPH_BACKFILL_BADGE_PADDING_PX}px`,
    borderRadius: '50%',
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  GroupedMarkerBack: createStyled<
    'span',
    { $offset: number; $isNear: boolean }
  >('span', ({ $theme, $offset, $isNear }) => ({
    position: 'absolute',
    right: `${$offset}px`,
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    borderRadius: '50%',
    backgroundColor: $isNear
      ? $theme.colors.backgroundTertiary
      : $theme.colors.backgroundSecondary,
    zIndex: $isNear ? 1 : 0,
  })),
  GroupedMarkerCount: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: $theme.colors.backgroundInversePrimary,
    color: $theme.colors.contentInversePrimary,
    ...$theme.typography.LabelXSmall,
    boxShadow: $theme.lighting.shadow400,
  })),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        color: $theme.colors.contentPrimary,
        ...$theme.typography.LabelSmall,
        padding: $theme.sizing.scale500,
      }),
    },
  } satisfies PopoverOverrides,
};
