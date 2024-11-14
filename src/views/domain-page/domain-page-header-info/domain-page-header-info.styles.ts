import { styled as createStyled } from 'baseui';

export const styled = {
  DomainDetailsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    columnGap: $theme.sizing.scale850,
    rowGap: $theme.sizing.scale500,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
    },
  })),
};
