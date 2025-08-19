import { styled as createStyled } from 'baseui';

export const styled = {
  SummaryJsonContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: $theme.sizing.scale200,
  })),
  SummaryJsonLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
  })),
};
