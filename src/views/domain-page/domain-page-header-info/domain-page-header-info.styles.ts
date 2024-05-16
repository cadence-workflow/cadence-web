import { styled as createStyled } from 'baseui';

export const styled = {
  DomainDetailsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    columnGap: $theme.sizing.scale850,
  })),
};
