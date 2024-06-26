import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ErrorContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: $theme.sizing.scale600,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  })),
  ErrorText: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.HeadingXSmall,
  })),
  ErrorActionsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: $theme.sizing.scale300,
      paddingTop: $theme.sizing.scale100,
    })
  ),
};
