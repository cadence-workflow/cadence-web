import { styled as createStyled } from 'baseui';

export const styled = {
  TaskListContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: $theme.sizing.scale800,
    rowGap: $theme.sizing.scale600,
  })),
  TaskListHeaderContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    columnGap: $theme.sizing.scale400,
  })),
};
