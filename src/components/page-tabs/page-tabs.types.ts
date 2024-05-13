import { IconProps } from 'baseui/icon';
import React from 'react';

export type PageTab = {
  key: string;
  title: string;
  artwork?: React.ComponentType<{
    size: IconProps['size'];
    color: IconProps['color'];
  }>;
};

export type PageTabsList = Array<PageTab>;

export type Props = {
  tabList: PageTabsList;
  selectedTab: React.Key;
  setSelectedTab: (value: React.Key) => void;
};
