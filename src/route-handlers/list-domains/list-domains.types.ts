import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListDomainsResponse = {
  domains: Array<Domain>;
};

export type ListDomainsErrorResponse = {
  error: string;
  cluster: string;
};

export type Context = DefaultMiddlewaresContext;
