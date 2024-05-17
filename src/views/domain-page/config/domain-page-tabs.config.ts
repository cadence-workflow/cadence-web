import type { DomainPageTabs } from '../domain-page-tabs/domain-page-tabs.types';

const domainPageTabsConfig = [
  { key: 'workflows', title: 'Workflows' },
  { key: 'metadata', title: 'Metadata' },
  { key: 'settings', title: 'Settings' },
] as const satisfies DomainPageTabs;

export default domainPageTabsConfig;
