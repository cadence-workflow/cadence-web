import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

import { CHART_HEIGHT_PX } from './schedule-detail-metrics-chart.constants';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    outline: `1px solid ${$theme.borders.border300.borderColor}`,
    borderRadius: $theme.borders.radius300,
    overflow: 'hidden',
  })),
  Toolbar: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
    padding: $theme.sizing.scale300,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    backgroundColor: $theme.colors.backgroundPrimary,
  })),
  ChartRegion: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'relative',
    width: '100%',
    height: `${CHART_HEIGHT_PX}px`,
    backgroundColor: $theme.colors.backgroundSecondary,
  })),
  ChartCanvas: createStyled<'div', { $isPanning?: boolean }>(
    'div',
    ({ $isPanning }: { $theme: Theme; $isPanning?: boolean }) => ({
      width: '100%',
      height: '100%',
      cursor: $isPanning ? 'grabbing' : 'grab',
      touchAction: 'none',
    })
  ),
  ChartSvg: createStyled('svg', () => ({
    display: 'block',
    width: '100%',
    height: '100%',
  })),
  LoadingOverlay: createStyled('div', () => ({
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  })),
  FetchLoadingOverlay: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    position: 'absolute',
    top: $theme.sizing.scale600,
    left: $theme.sizing.scale600,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
    paddingTop: $theme.sizing.scale100,
    paddingBottom: $theme.sizing.scale100,
    paddingLeft: $theme.sizing.scale300,
    paddingRight: $theme.sizing.scale300,
    borderRadius: $theme.borders.radius200,
    backgroundColor: $theme.colors.backgroundPrimary,
    boxShadow: $theme.lighting.shadow400,
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentSecondary,
  })),
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
    paddingTop: $theme.sizing.scale200,
    paddingBottom: $theme.sizing.scale200,
    paddingLeft: $theme.sizing.scale200,
    paddingRight: $theme.sizing.scale200,
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
