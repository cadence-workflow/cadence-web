import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PanelContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: $theme.sizing.scale600,
    padding: `${$theme.sizing.scale900} ${$theme.sizing.scale600}`,
  })),
  Spacer: createStyled<'div', { $heightPercent: number }>(
    'div',
    ({ $heightPercent }) => ({
      flex: `1 1 ${$heightPercent}%`,
    })
  ),
};
