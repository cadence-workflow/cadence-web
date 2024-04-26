import { withStyle } from 'baseui';
import { Spinner } from 'baseui/spinner';

export const styled = {
  Spinner: withStyle(Spinner, ({ $theme }) => ({
    width: $theme.sizing.scale300,
    height: $theme.sizing.scale300,
    borderWidth: '2px',
    marginRight: '1px',
    borderRightColor: $theme.colors.accent200,
    borderLeftColor: $theme.colors.accent200,
    borderBottomColor: $theme.colors.accent200,
  })),
};
