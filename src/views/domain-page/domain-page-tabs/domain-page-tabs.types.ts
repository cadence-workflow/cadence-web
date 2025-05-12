import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type domainPageTabsConfig from '../config/domain-page-tabs.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import { type DomainPageTabErrorConfig } from '../domain-page-tabs-error/domain-page-tabs-error.types';

export type DomainPageTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
  content: React.ComponentType<DomainPageTabContentProps>;
  getErrorConfig: (err: Error) => DomainPageTabErrorConfig;
};

export type DomainPageTabsConfig<K extends string> = Record<
  K,
  DomainPageTabConfig
>;

export type DomainPageTabName = keyof typeof domainPageTabsConfig;

export type DomainPageTabsParams = {
  domain: string;
  cluster: string;
  domainTab: DomainPageTabName;
};
