import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  PanelSectionContainer: createStyled(
    'section',
    ({ $theme }: { $theme: Theme }) => ({
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      gap: $theme.sizing.scale600,
      paddingTop: $theme.sizing.scale900,
      paddingBottom: $theme.sizing.scale1200,
      paddingLeft: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale600,
    })
  ),
  Spacer: createStyled<'div', { $height: string }>('div', ({ $height }) => ({
    flex: `1 1 ${$height}`,
  })),
};
