import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';
import { type DomainInfo } from '@/views/domain-page/domain-page.types';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type Context = DefaultMiddlewaresContext;
export type DescribeDomainResponse = DomainInfo;
