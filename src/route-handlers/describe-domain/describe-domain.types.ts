import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type Context = DefaultMiddlewaresContext;
export type DescribeDomainResponse = Domain;
