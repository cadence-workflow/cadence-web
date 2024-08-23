import { MdListAlt, MdSettings, MdSort } from 'react-icons/md';

import type { DomainPageTabs } from '../domain-page-tabs/domain-page-tabs.types';

const domainPageTabsConfig = [
  {
    key: 'workflows',
    title: 'Workflows',
    artwork: MdSort,
  },
  {
    key: 'metadata',
    title: 'Metadata',
    artwork: MdListAlt,
  },
  {
    key: 'settings',
    title: 'Settings',
    artwork: MdSettings,
  },
] as const satisfies DomainPageTabs;

export default domainPageTabsConfig;
