import { styled as createStyled } from 'baseui';

export const styled = {
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
