import React from 'react';

import { Tabs, Tab } from 'baseui/tabs-motion';

import { overrides, styled } from './page-tabs.styles';
import { type Props } from './page-tabs.types';

export default function PageTabs({
  tabList,
  selectedTab,
  setSelectedTab,
  endEnhancer,
}: Props) {
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
