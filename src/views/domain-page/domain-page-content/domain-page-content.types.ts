import domainPageTabsConfig from '../config/domain-page-tabs.config';

type DomainTabName = (typeof domainPageTabsConfig)[number]['key'];

export type DomainPageContentParams = {
  domain: string;
  cluster: string;
  domainTab: DomainTabName;
};

export type Props = {
  params: DomainPageContentParams;
};

export type DomainPageTabContentProps = {
  domain: string;
  cluster: string;
};

export type DomainPageTabsContentConfig = Record<
  DomainTabName,
  React.ComponentType<DomainPageTabContentProps>
>;
