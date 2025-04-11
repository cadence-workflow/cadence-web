import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { StyledLink } from 'baseui/link';

export const styled = {
  ClusterTextContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      ...$theme.typography.ParagraphSmall,
    })
  ),
  Link: withStyle(StyledLink, ({ $theme }) => ({
    ...$theme.typography.ParagraphSmall,
  })),
};
