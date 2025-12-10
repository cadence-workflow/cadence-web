import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  DetailsRowContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale300,
    ...$theme.typography.LabelXSmall,
    overflow: 'hidden',
  })),
  DetailsFieldContainer: createStyled<
    'div',
    { $isNegative: boolean; $omitWrapping: boolean }
  >(
    'div',
    ({
      $theme,
      $isNegative,
      $omitWrapping,
    }: {
      $theme: Theme;
      $isNegative: boolean;
      $omitWrapping: boolean;
    }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale100,
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
      height: $theme.sizing.scale700,
      ...($omitWrapping
        ? {}
        : {
            padding: `${$theme.sizing.scale0} ${$theme.sizing.scale100}`,
            backgroundColor: $isNegative
              ? $theme.colors.backgroundNegativeLight
              : $theme.colors.backgroundSecondary,
            borderRadius: $theme.borders.radius200,
          }),
    })
  ),
};

export const overrides = {
  popover: {
    Inner: {
      style: {
        maxWidth: '500px',
      },
    },
  },
  popoverInverted: {
    Arrow: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
      }),
    },
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        color: $theme.colors.contentPrimary,
        maxWidth: '500px',
      }),
    },
  } satisfies PopoverOverrides,
};
