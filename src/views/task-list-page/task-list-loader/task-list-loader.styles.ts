import { styled as createStyled } from 'baseui';

export const styled = {
  TaskListContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale600,
  })),
};
