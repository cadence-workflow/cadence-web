import { type Theme, styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  TooltipContentContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    rowGap: $theme.sizing.scale600,
    padding: $theme.sizing.scale600,
  })),
  TooltipText: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    lineHeight: '16px',
  })),
  TooltipLinkButtons: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    columnGap: $theme.sizing.scale300,
  })),
};

export const overrides = {
  buttonPrimary: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        padding: $theme.sizing.scale300,
        color: $theme.colors.contentInversePrimary,
        backgroundColor: $theme.colors.backgroundAccent,
        ':hover': {
          backgroundColor: $theme.colors.accent500,
        },
        ':active': {
          backgroundColor: $theme.colors.accent500,
        },
      }),
    },
  } satisfies ButtonOverrides,
  buttonSecondary: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale900,
        padding: $theme.sizing.scale300,
        color: $theme.colors.contentAccent,
        backgroundColor: $theme.colors.backgroundAccentLight,
        ':hover': {
          backgroundColor: $theme.colors.accent100,
        },
        ':active': {
          backgroundColor: $theme.colors.accent100,
        },
      }),
    },
  } satisfies ButtonOverrides,
  popover: {
    Body: {
      style: ({ $theme }) => ({
        margin: $theme.sizing.scale600,
      }),
    },
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        maxWidth: '400px',
      }),
    },
    Arrow: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
      }),
    },
  } satisfies PopoverOverrides,
};
