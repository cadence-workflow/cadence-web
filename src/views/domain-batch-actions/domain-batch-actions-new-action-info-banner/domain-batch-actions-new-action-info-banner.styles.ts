import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  TextContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
      gap: $theme.sizing.scale100,
    })
  ),
  Title: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
    })
  ),
  Subtitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      color: $theme.colors.contentSecondary,
    })
  ),
};
