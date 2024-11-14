import type React from 'react';

import { type IconProps } from 'baseui/icon';
import { type TabsProps } from 'baseui/tabs-motion';

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
  endEnhancer?: TabsProps['endEnhancer'];
};
