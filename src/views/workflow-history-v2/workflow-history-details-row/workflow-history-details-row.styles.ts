import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  DetailsRowContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale300,
    ...$theme.typography.LabelXSmall,
    flexWrap: 'wrap',
  })),
  DetailsFieldContainer: createStyled<
    'div',
    {
      $isNegative: boolean;
      $omitWrapping: boolean;
      $badgeColor?: 'warning';
    }
  >(
    'div',
    ({
      $theme,
      $isNegative,
      $omitWrapping,
      $badgeColor,
    }: {
      $theme: Theme;
      $isNegative: boolean;
      $omitWrapping: boolean;
      $badgeColor?: 'warning';
    }) => {
      let color: string;
      let backgroundColorWhenWrapped: string;

      if ($isNegative) {
        color = $theme.colors.contentNegative;
        backgroundColorWhenWrapped = $theme.colors.backgroundNegativeLight;
      } else if ($badgeColor === 'warning') {
        color = $theme.colors.warning700;
        backgroundColorWhenWrapped = $theme.colors.backgroundWarningLight;
      } else {
        color = $theme.colors.contentPrimary;
        backgroundColorWhenWrapped = $theme.colors.backgroundSecondary;
      }

      return {
        display: 'flex',
        alignItems: 'center',
        gap: $theme.sizing.scale100,
        color,
        height: $theme.sizing.scale700,
        ...($omitWrapping
          ? {}
          : {
              padding: `${$theme.sizing.scale0} ${$theme.sizing.scale100}`,
              backgroundColor: backgroundColorWhenWrapped,
              borderRadius: $theme.borders.radius200,
            }),
      };
    }
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
