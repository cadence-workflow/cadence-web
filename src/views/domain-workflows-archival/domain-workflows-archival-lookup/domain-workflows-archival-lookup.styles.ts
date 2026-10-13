import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Form: createStyled('form', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: $theme.sizing.scale500,
    width: '100%',
    maxWidth: '320px',
  })),
  FieldsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale300,
    width: '100%',
  })),
};
