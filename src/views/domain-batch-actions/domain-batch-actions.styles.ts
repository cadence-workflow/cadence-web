import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Container: createStyled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
  })),
  Sidebar: createStyled('aside', () => ({
    width: '20%',
    minWidth: '180px',
    flexShrink: 0,
  })),
  DetailPanel: createStyled('main', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: $theme.sizing.scale600,
  })),
};
