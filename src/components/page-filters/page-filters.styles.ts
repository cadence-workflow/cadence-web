import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  SearchInputContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale500,
      marginBottom: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
      },
    })
  ),
};
