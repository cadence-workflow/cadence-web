import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PageContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: $theme.sizing.scale1000,
    [$theme.mediaQuery.medium]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  })),
  DetailsSectionsContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }) => ({
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale900,
    })
  ),
  JsonPanel: createStyled('div', () => ({
    minWidth: 0,
  })),
};
