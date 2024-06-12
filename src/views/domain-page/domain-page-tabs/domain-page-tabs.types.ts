import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type domainPageTabsConfig from '../config/domain-page-tabs.config';

export type DomainPageTabs = Array<PageTab>;

export type DomainPageTabsParams = {
  domain: string;
  cluster: string;
  domainTab: (typeof domainPageTabsConfig)[number]['key'];
};
