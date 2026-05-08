import { styled as createStyled, withStyle, type Theme } from 'baseui';
import { Spinner } from 'baseui/spinner';

export const styled = {
  BadgeContent: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelXSmall,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
    whiteSpace: 'nowrap',
  })),
  RunningSpinner: withStyle(Spinner, ({ $theme }) => ({
    width: $theme.sizing.scale500,
    height: $theme.sizing.scale500,
    borderWidth: '2px',
    marginRight: '1px',
    marginLeft: '1px',
    borderTopColor: $theme.colors.contentInversePrimary,
    borderRightColor: $theme.colors.accent300,
    borderLeftColor: $theme.colors.accent300,
    borderBottomColor: $theme.colors.accent300,
  })),
};
