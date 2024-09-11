import { styled as createStyled } from 'baseui';

export const styled = {
  TaskListContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: $theme.sizing.scale600,
    rowGap: $theme.sizing.scale600,
  })),
};
