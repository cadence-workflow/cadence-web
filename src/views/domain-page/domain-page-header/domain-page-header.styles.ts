import { styled as createStyled } from 'baseui';

export const styled = {
  HeaderContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: $theme.sizing.scale700,
    marginTop: $theme.sizing.scale1000,
  })),
  DomainInfoContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale500,
  })),
  DomainNameLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.HeadingSmall,
  })),
};
