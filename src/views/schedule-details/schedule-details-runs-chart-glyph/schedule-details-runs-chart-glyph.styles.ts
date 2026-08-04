import { styled as createStyled, type Theme } from 'baseui';
import { type SkeletonOverrides } from 'baseui/skeleton/types';

import { CHART_GLYPH_ENTER_ANIMATION_MS } from '../schedule-details-runs-chart/schedule-details-runs-chart.constants';

import { CHART_GLYPH_MARKER_SIZE_PX } from './schedule-details-runs-chart-glyph.constants';

export const overrides = {
  loadingSkeleton: {
    Root: {
      style: { borderRadius: '50%' },
    },
  } satisfies SkeletonOverrides,
};

export const styled = {
  // Position is applied as an inline transform, not as a styled prop:
  // Styletron mints a permanent class per distinct declaration, so panning
  // would inject a new rule per glyph per frame. `$isNew` is a two-valued
  // toggle set once on mount, so it stays safe as a styled prop.
  Marker: createStyled<'div', { $isNew: boolean }>(
    'div',
    ({ $theme, $isNew }) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // The opaque background hides the timeline line behind outline icons
      backgroundColor: $theme.colors.backgroundPrimary,
      borderRadius: '50%',
      pointerEvents: 'none',
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
  Icon: createStyled('span', () => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    flexShrink: 0,
  })),
  Skipped: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'inline-block',
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    boxSizing: 'border-box',
    border: `1px dashed ${$theme.colors.contentSecondary}`,
    borderRadius: '50%',
  })),
  BackfillBadge: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    display: 'flex',
    padding: '2px',
    borderRadius: '50%',
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  GroupedMarker: createStyled('span', () => ({
    position: 'relative',
    display: 'block',
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
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
  })),
  GroupedMarkerCount: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: $theme.colors.backgroundInversePrimary,
    color: $theme.colors.contentInversePrimary,
    ...$theme.typography.LabelXSmall,
  })),
};
