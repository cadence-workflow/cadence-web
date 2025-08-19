import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  SummaryFieldsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale600,
    ...$theme.typography.LabelXSmall,
  })),
  SummaryFieldContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }: { $theme: Theme; $isNegative: boolean }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale300,
      color: $isNegative
        ? $theme.colors.contentNegative
        : $theme.colors.contentPrimary,
    })
  ),
};

export const overrides = {
  popoverLight: {
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
  popoverDark: {
    Arrow: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundInversePrimary,
      }),
    },
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundInversePrimary,
        maxWidth: '500px',
      }),
    },
  } satisfies PopoverOverrides,
};
