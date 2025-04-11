import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  ClusterTextContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      ...$theme.typography.ParagraphSmall,
    })
  ),
};
