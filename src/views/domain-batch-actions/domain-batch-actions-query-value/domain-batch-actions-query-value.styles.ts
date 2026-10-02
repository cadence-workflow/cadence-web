import { styled as createStyled, type Theme } from 'baseui';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  QueryContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      color: '#A964F7',
      display: 'inline-block',
      maxWidth: '360px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      padding: `${$theme.sizing.scale0} ${$theme.sizing.scale100}`,
      backgroundColor: $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius200,
      ...$theme.typography.MonoParagraphXSmall,
    })
  ),
  Tooltip: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      color: '#A964F7',
      wordBreak: 'break-word',
      ...$theme.typography.MonoParagraphXSmall,
    })
  ),
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
