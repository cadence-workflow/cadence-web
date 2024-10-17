import type React from 'react';

import { type IconProps } from 'baseui/icon';

export type PageTab = {
  key: string;
  title: string;
  endEnhancer?: React.ComponentType<Record<string, never>>;
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
