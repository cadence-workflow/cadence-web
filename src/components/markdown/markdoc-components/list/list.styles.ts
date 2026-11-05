import { styled as createStyled } from 'baseui';

export const styled = {
  UnorderedList: createStyled('ul', ({ $theme }) => ({
    marginBottom: $theme.sizing.scale500,
    marginTop: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale700,
    listStyleType: 'disc',
    ':first-child': {
      marginTop: 0,
    },
    ':last-child': {
      marginBottom: 0,
    },
  })),
  OrderedList: createStyled('ol', ({ $theme }) => ({
    marginBottom: $theme.sizing.scale500,
    marginTop: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale700,
    listStyleType: 'decimal',
    ':first-child': {
      marginTop: 0,
    },
    ':last-child': {
      marginBottom: 0,
    },
  })),
};
