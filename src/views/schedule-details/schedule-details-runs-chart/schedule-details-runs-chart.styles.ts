import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

import {
  CHART_HEADER_MIN_HEIGHT_PX,
  CHART_HEIGHT_PX,
  CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX,
} from './schedule-details-runs-chart.constants';

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
  ChartSvg: createStyled('svg', () => ({
    display: 'block',
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

export const overrides = {
  toolbarButton: {
    Root: toolbarButtonRootOverrides,
  } satisfies ButtonOverrides,
};
