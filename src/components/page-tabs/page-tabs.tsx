import React from 'react';
import { Tabs, Tab } from 'baseui/tabs-motion';
import { Props } from './page-tabs.types';
import { overrides } from './page-tabs.styles';

export default function PageTabs({
  tabList,
  selectedTab,
  setSelectedTab,
}: Props) {
  return (
    <Tabs
      activeKey={selectedTab}
      onChange={({ activeKey }) => {
        setSelectedTab(activeKey);
      }}
      overrides={overrides.tabs}
    >
      {tabList.map(({ key, title, artwork }) => (
        <Tab
          overrides={overrides.tab}
          key={key}
          title={title}
          artwork={artwork}
        />
      ))}
    </Tabs>
  );
}
