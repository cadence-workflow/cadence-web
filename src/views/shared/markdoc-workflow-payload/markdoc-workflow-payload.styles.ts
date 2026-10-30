import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      position: 'relative',
      padding: $theme.sizing.scale600,
      backgroundColor: $theme.colors.backgroundSecondary,
      borderRadius: $theme.borders.radius300,
      overflow: 'auto',
    })
  ),
  Text: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphMedium,
      wordBreak: 'break-word',
    })
  ),
  Placeholder: createStyled(
    'span',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      color: $theme.colors.contentTertiary,
    })
  ),
};

export const overrides = {
  copyButton: {
    BaseButton: {
      style: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  } satisfies ButtonOverrides,
};
