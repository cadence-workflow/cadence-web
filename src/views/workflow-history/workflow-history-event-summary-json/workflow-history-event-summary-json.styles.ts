import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  JsonViewContainer: createStyled<'div', { $isNegative: boolean }>(
    'div',
    ({ $theme, $isNegative }) => ({
      padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
      color: $isNegative ? $theme.colors.contentNegative : '#A964F7',
      backgroundColor: $isNegative
        ? $theme.colors.backgroundNegativeLight
        : $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      maxHeight: $theme.sizing.scale800,
      maxWidth: '360px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...$theme.typography.MonoParagraphXSmall,
    })
  ),
  JsonPreviewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale200,
  })),
  JsonPreviewLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
  })),
};

export const overrides = {
  popover: {
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
