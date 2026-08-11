import { styled as createStyled, type Theme } from 'baseui';
import type { ButtonOverrides } from 'baseui/button';

export const styled = {
  JsonViewWrapper: createStyled('div', {
    position: 'relative',
    width: '100%',
  }),
  JsonViewContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      padding: $theme.sizing.scale600,
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      maxHeight: '50vh',
      overflow: 'auto',
    })
  ),
  JsonViewHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    position: 'absolute',
    right: $theme.sizing.scale400,
    top: $theme.sizing.scale400,
  })),
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
