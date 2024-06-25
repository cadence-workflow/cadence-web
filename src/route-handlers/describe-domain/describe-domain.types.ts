import { type DomainInfo } from '@/views/domain-page/domain-page.types';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeDomainResponse = DomainInfo;
