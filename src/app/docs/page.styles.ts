import { styled as createStyled } from 'baseui';

export const styled = {
  Header: createStyled('div', ({ $theme }) => ({
    marginBottom: $theme.sizing.scale800,
    paddingBottom: $theme.sizing.scale600,
    borderBottom: `2px solid ${$theme.colors.borderOpaque}`,
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  })),

  ContentContainer: createStyled('div', ({ $theme }) => ({
    padding: `${$theme.sizing.scale800} 0`,
  })),
};
