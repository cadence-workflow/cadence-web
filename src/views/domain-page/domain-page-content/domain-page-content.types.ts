import { type DomainPageTabName } from '../domain-page-tabs/domain-page-tabs.types';

export type DomainPageContentParams = {
  domain: string;
  cluster: string;
  domainTab: DomainPageTabName;
};

export type Props = {
  params: DomainPageContentParams;
};

export type DomainPageTabContentProps = {
  domain: string;
  cluster: string;
};
