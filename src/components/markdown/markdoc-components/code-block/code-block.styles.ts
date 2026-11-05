import { styled as createStyled } from 'baseui';

export const styled = {
  Pre: createStyled('pre', ({ $theme }) => ({
    marginBottom: $theme.sizing.scale600,
    marginTop: $theme.sizing.scale600,
    backgroundColor: $theme.colors.backgroundTertiary,
    padding: $theme.sizing.scale500,
    borderRadius: $theme.borders.radius300,
    border: `1px solid ${$theme.colors.backgroundTertiary}`,
    overflow: 'auto',
  })),
  Code: createStyled('code', ({ $theme }) => ({
    ...$theme.typography.MonoLabelMedium,
    backgroundColor: 'transparent',
    padding: 0,
    border: 'none',
    fontSize: 'inherit',
  })),
};
