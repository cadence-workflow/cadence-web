import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  RootCausesList: createStyled('ul', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale200,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    width: '100%',
  })),
  RootCauseItem: createStyled('li', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale100,
  })),
  RootCauseHeader: createStyled('div', {
    display: 'flex',
    alignItems: 'flex-start',
  }),
  RootCauseType: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
  })),
  RootCauseMetadata: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingLeft: $theme.sizing.scale600,
  })),
};
