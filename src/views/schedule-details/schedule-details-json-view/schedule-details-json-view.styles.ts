import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const styled = {
  Root: createStyled<'div', { $noTitle?: boolean }>('div', ({ $noTitle }) => ({
    ...($noTitle && {
      position: 'relative',
      width: '100%',
    }),
  })),
  Body: createStyled<'div', { $limitHeight?: boolean }>(
    'div',
    ({ $theme, $limitHeight }) => ({
      padding: $theme.sizing.scale600,
      backgroundColor: $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      ...($limitHeight && {
        maxHeight: '50vh',
        overflow: 'auto',
      }),
    })
  ),
  Header: createStyled<'div', { $noTitle?: boolean }>(
    'div',
    ({ $theme, $noTitle }) => ({
      display: 'flex',
      ...($noTitle
        ? {
            position: 'absolute',
            right: $theme.sizing.scale400,
            top: $theme.sizing.scale400,
          }
        : {
            justifyContent: 'space-between',
            gap: $theme.sizing.scale600,
            marginBottom: $theme.sizing.scale700,
          }),
    })
  ),
  Title: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
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
