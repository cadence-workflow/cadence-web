import { type ZodIssue } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type listDomainsQueryParamsSchema from './schemas/list-domains-query-params-schema';

import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type RouteParams = {
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListDomainsQueryParams = Zod.input<
  typeof listDomainsQueryParamsSchema
>;

export type ListDomainsResponse = {
  domains: Array<Domain>;
  nextPage: string;
};

export type ListDomainsErrorResponse = {
  error: string;
  cluster: string;
  validationErrors?: Array<ZodIssue>;
};

export type Context = DefaultMiddlewaresContext;
