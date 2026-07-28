import { styled as createStyled, type Theme } from 'baseui';

import {
  CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX,
  CHART_GLYPH_BACKFILL_BADGE_PADDING_PX,
  CHART_GLYPH_MARKER_SIZE_PX,
} from './schedule-details-runs-chart-series-glyph.constants';

export const styled = {
  // Position is an inline transform, not a styled prop: Styletron mints a
  // permanent class per distinct declaration, so one per marker would leak.
  // The opaque background hides the timeline line behind outline icons
  // (checkmark, target ring, dashed dot) that would otherwise let it show
  // through their transparent centers.
  Marker: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    height: `${CHART_GLYPH_MARKER_SIZE_PX}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $theme.colors.backgroundPrimary,
    borderRadius: '50%',
    pointerEvents: 'none',
  })),
  Icon: createStyled<'span', { $scale?: number }>('span', ({ $scale }) => ({
    display: 'inline-flex',
    ...($scale == null ? {} : { transform: `scale(${$scale})` }),
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
    top: `-${CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX}px`,
    right: `-${CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX}px`,
    display: 'flex',
    padding: `${CHART_GLYPH_BACKFILL_BADGE_PADDING_PX}px`,
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
