import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled<'div', { $isError: boolean }>(
    'div',
    ({ $theme, $isError }) => ({
      // TODO: revisit this when PageSection is fixed
      minHeight: '50vh',
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
      padding: $theme.sizing.scale600,
      backgroundColor: $isError
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      ...($isError && {
        borderColor: $theme.colors.contentNegative,
        borderWidth: '2px',
        borderStyle: 'solid',
      }),
    })
  ),
};
