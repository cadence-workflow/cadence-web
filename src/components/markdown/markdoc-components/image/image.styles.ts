import { styled as createStyled } from 'baseui';

export const styled = {
  Image: createStyled('img', ({ $theme }) => ({
    maxWidth: '100%',
    height: 'auto',
    marginTop: $theme.sizing.scale400,
    marginBottom: $theme.sizing.scale400,
    borderRadius: $theme.borders.radius200,
    border: `1px solid ${$theme.colors.backgroundTertiary}`,
  })),
};
