import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

import {
  CHART_HEADER_MIN_HEIGHT_PX,
  CHART_HEIGHT_PX,
  CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX,
} from './schedule-detail-metrics-chart.constants';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: `1px solid ${$theme.colors.borderOpaque}`,
    borderRadius: $theme.borders.radius300,
    overflow: 'hidden',
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  Header: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: `${CHART_HEADER_MIN_HEIGHT_PX}px`,
    gap: $theme.sizing.scale300,
    paddingTop: $theme.sizing.scale100,
    paddingBottom: $theme.sizing.scale100,
    paddingLeft: $theme.sizing.scale300,
    paddingRight: $theme.sizing.scale100,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  Summary: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: '1 1 auto',
    alignItems: 'center',
    minWidth: 0,
    gap: $theme.sizing.scale300,
    ...$theme.typography.LabelXSmall,
  })),
  SummaryTitle: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentPrimary,
    fontWeight: 500,
  })),
  SummaryItem: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
  })),
  Toolbar: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
    gap: $theme.sizing.scale100,
  })),
  ControlContent: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
  })),
  ChartRegion: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'relative',
    width: '100%',
    height: `${CHART_HEIGHT_PX}px`,
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  ChartCanvas: createStyled<'div', { $isPanning?: boolean; $canPan?: boolean }>(
    'div',
    ({ $isPanning, $canPan }) => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      cursor: !$canPan ? 'default' : $isPanning ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    })
  ),
  ChartSvg: createStyled('svg', () => ({
    display: 'block',
    width: '100%',
    height: '100%',
  })),
  /** Holds the absolutely positioned glyphs above the SVG series. */
  GlyphOverlay: createStyled('div', () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  })),

  LoadingOverlay: createStyled('div', () => ({
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  })),
  FetchLoadingContainer: createStyled<'div', { $isError: boolean }>(
    'div',
    ({ $theme, $isError }) => ({
      position: 'absolute',
      top: $theme.sizing.scale400,
      left: $theme.sizing.scale400,
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: $isError ? 0 : $theme.sizing.scale200,
      borderRadius: $isError ? '999px' : '50%',
      backgroundColor: $theme.colors.backgroundPrimary,
      boxShadow: $theme.lighting.shadow400,
    })
  ),
  EmptyState: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    ...$theme.typography.ParagraphSmall,
    color: $theme.colors.contentSecondary,
  })),
};

const toolbarButtonRootOverrides = {
  style: ({ $theme }: { $theme: Theme }): StyleObject => ({
    minHeight: `${CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX}px`,
    paddingTop: $theme.sizing.scale100,
    paddingBottom: $theme.sizing.scale100,
    paddingLeft: $theme.sizing.scale200,
    paddingRight: $theme.sizing.scale200,
    ...$theme.typography.LabelXSmall,
  }),
};

const loadingSkeletonOverrides = {
  Root: {
    style: (): StyleObject => ({
      width: '100%',
      height: '100%',
    }),
  },
};

export const overrides = {
  loadingSkeleton: loadingSkeletonOverrides,
  toolbarButton: {
    Root: toolbarButtonRootOverrides,
  } satisfies ButtonOverrides,
};
