import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  FailoverEventContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      gap: $theme.sizing.scale600,
      alignItems: 'baseline',
    })
  ),
  ClusterFailoverContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'baseline',
      gap: $theme.sizing.scale300,
    })
  ),
  ClusterAttributeLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      ...$theme.typography.LabelSmall,
    })
  ),
};
