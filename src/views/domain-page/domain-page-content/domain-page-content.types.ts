import domainPageTabsConfig from '../config/domain-page-tabs.config';

export type DomainPageContentParams = {
  domain: string;
  cluster: string;
  domainTab: (typeof domainPageTabsConfig)[number]['key'];
};

export type Props = {
  params: DomainPageContentParams;
};
