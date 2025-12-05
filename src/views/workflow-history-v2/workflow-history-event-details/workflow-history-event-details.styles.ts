import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  EmptyDetails: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentTertiary,
    textAlign: 'center',
    padding: `${$theme.sizing.scale700} 0`,
  })),
  EventDetailsContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
  }),
  PanelDetails: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
    gap: $theme.sizing.scale500,
    paddingBottom: $theme.sizing.scale500,
    alignItems: 'stretch',
  })),
  PanelContainer: createStyled('div', {
    flex: 1,
  }),
  RestDetails: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingLeft: $theme.sizing.scale100,
    paddingRight: $theme.sizing.scale100,
  })),
};
