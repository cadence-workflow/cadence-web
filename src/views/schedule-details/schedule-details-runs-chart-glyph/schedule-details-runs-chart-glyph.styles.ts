import { styled as createStyled, type Theme } from 'baseui';
import { type SkeletonOverrides } from 'baseui/skeleton/types';

import { CHART_GLYPH_MARKER_SIZE_PX } from './schedule-details-runs-chart-glyph.constants';

export const overrides = {
  loadingSkeleton: {
    Root: {
      style: { borderRadius: '50%' },
    },
  } satisfies SkeletonOverrides,
};

export const styled = {
  Marker: createStyled<'div', { $positioned?: boolean }>(
    'div',
    ({
      $theme,
      $positioned = true,
    }: {
      $theme: Theme;
      $positioned?: boolean;
    }) => ({
      position: $positioned ? 'absolute' : 'relative',
      top: $positioned ? 0 : undefined,
      left: $positioned ? 0 : undefined,
      width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // The opaque background hides the timeline line behind outline icons
      backgroundColor: $theme.colors.backgroundPrimary,
      borderRadius: '50%',
      pointerEvents: 'none',
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
