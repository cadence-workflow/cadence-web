import { styled as createStyled, withStyle, type Theme } from 'baseui';

import PageSection from '@/components/page-section/page-section';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
  })),
  TabsRow: withStyle(PageSection, {
    display: 'flex',
    alignItems: 'center',
  }),
  BackSlot: createStyled('div', () => ({
    display: 'flex',
  })),
  BackTabsDivider: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: $theme.borders.border100.borderWidth,
    height: $theme.sizing.scale700,
    backgroundColor: $theme.colors.borderOpaque,
    marginLeft: $theme.sizing.scale300,
    marginRight: $theme.sizing.scale300,
  })),
  TabsSlot: createStyled('div', () => ({
    flex: 1,
    minWidth: 0,
  })),
};
