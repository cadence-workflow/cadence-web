import { styled as createStyled } from 'baseui';

export const styled = {
  TableContainer: createStyled('div', {
    overflowX: 'auto',
  }),
  ErrorPanelContainer: createStyled('div', ({ $theme }) => ({
    padding: `${$theme.sizing.scale1200} 0px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })),
};
