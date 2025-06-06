import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const styled = {
  ViewContainer: createStyled<'div', { $isError: boolean }>(
    'div',
    ({ $theme, $isError }) => ({
      flex: '1 0 150px',
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

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
