import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

import { type ScheduleMetricsChartGlyphVariant } from './schedule-detail-metrics-chart-series.types';
import {
  CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX,
  CHART_GLYPH_BACKFILL_BADGE_PADDING_PX,
  CHART_GLYPH_ENTER_ANIMATION_MS,
  CHART_GLYPH_HIT_AREA_RADIUS_PX,
  CHART_GLYPH_MARKER_SIZE_PX,
} from './schedule-detail-metrics-chart.constants';

export const styled = {
  // Position is applied as an inline transform by the glyph, not as a styled
  // prop: Styletron mints a permanent class per distinct declaration, so
  // panning would inject a new rule per glyph per frame.
  MarkerButton: createStyled<
    'button',
    {
      $variant: ScheduleMetricsChartGlyphVariant;
    }
  >('button', ({ $theme, $variant }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
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
  // The enter animation lives here rather than on the button, whose transform
  // is the glyph's position on the timeline.
  StatusMarker: createStyled<'span', { $isNew: boolean }>(
    'span',
    ({ $isNew }) => ({
      position: 'relative',
      display: 'flex',
      width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      ...($isNew
        ? {
            animationName: {
              from: { opacity: 0, transform: 'scale(0.4)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
            animationDuration: `${CHART_GLYPH_ENTER_ANIMATION_MS}ms`,
            animationTimingFunction: 'ease-out',
            '@media (prefers-reduced-motion: reduce)': {
              animationName: 'none',
            },
          }
        : {}),
    })
  ),
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
