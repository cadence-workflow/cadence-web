import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  HeaderContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    marginTop: $theme.sizing.scale950,
    marginBottom: $theme.sizing.scale900,
  })),
  InputContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    marginBottom: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
  SearchContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
};
