import { styled as createStyled, type Theme } from 'baseui';

import { getPageTabsTabBarInsetStyle } from '@/components/page-tabs/page-tabs.styles';

export const styled = {
  TabsRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    ...getPageTabsTabBarInsetStyle({ $theme }),
  })),
  BackSlot: createStyled('div', () => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  })),
  BackTabsDivider: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    width: $theme.borders.border100.borderWidth,
    height: $theme.sizing.scale700,
    alignSelf: 'center',
    flexShrink: 0,
    backgroundColor: $theme.colors.borderOpaque,
    marginLeft: $theme.sizing.scale300,
    marginRight: $theme.sizing.scale300,
  })),
  TabsSlot: createStyled('div', () => ({
    flex: 1,
    minWidth: 0,
  })),
};
