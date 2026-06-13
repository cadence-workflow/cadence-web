import React from 'react';

import { Tabs, Tab } from 'baseui/tabs-motion';

import { overrides as getOverrides, styled } from './page-tabs.styles';
import { type Props } from './page-tabs.types';

export default function PageTabs({
  tabList,
  selectedTab,
  setSelectedTab,
  endEnhancer,
  applyTabBarGridGutters = true,
  hideTabBarBorder = false,
}: Props) {
  const overrides = getOverrides({ applyTabBarGridGutters, hideTabBarBorder });

  return (
    <Tabs
      activeKey={selectedTab}
      onChange={({ activeKey }) => {
        setSelectedTab(activeKey);
      }}
      overrides={overrides.tabs}
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
