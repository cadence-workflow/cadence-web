import { styled as createStyled } from 'baseui';

export const styled = {
  Code: createStyled('code', ({ $theme }) => ({
    ...$theme.typography.MonoLabelSmall,
    backgroundColor: $theme.colors.backgroundTertiary,
    padding: `${$theme.sizing.scale100} ${$theme.sizing.scale200}`,
    borderRadius: $theme.borders.radius200,
    border: `1px solid ${$theme.colors.backgroundTertiary}`,
    fontSize: '0.875em',
  })),
};
