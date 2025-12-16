import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  DomainCronListContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      marginTop: $theme.sizing.scale950,
      marginBottom: $theme.sizing.scale900,
    })
  ),
};
