import React, { useMemo } from 'react';

import { mergeOverrides } from 'baseui/helpers/overrides';
import { Tabs, Tab } from 'baseui/tabs-motion';

import {
  getPageTabsTabBarFlushInsetStyle,
  overrides,
  styled,
} from './page-tabs.styles';
import { type Props } from './page-tabs.types';

export default function PageTabs({
  tabList,
  selectedTab,
  setSelectedTab,
  endEnhancer,
  omitTabBarResponsiveInset = false,
}: Props) {
  const tabsOverrides = useMemo(
    () =>
      omitTabBarResponsiveInset
        ? mergeOverrides(overrides.tabs, {
            Root: {
              style: () => ({
                borderBottom: 'none',
              }),
            },
            TabBar: {
              style: ({ $theme }) => getPageTabsTabBarFlushInsetStyle({ $theme }),
            },
          })
        : overrides.tabs,
    [omitTabBarResponsiveInset]
  );

  return (
    <Tabs
      activeKey={selectedTab}
      onChange={({ activeKey }) => {
        setSelectedTab(activeKey);
      }}
      overrides={tabsOverrides}
      endEnhancer={endEnhancer}
    >
      {tabList.map((tab) => (
        <Tab
          overrides={overrides.tab}
          key={tab.key}
          title={
            <styled.TabTitleContainer>
              {tab.title}
              {tab.endEnhancer ? <tab.endEnhancer /> : null}
            </styled.TabTitleContainer>
          }
          artwork={tab.artwork}
        />
      ))}
    </Tabs>
  );
}
