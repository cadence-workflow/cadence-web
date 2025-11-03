import { type z } from 'zod';

import { type ListFailoverHistoryResponse as ListFailoverHistoryResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListFailoverHistoryResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type listFailoverHistoryQueryParamsSchema from './schemas/list-failover-history-query-params-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListFailoverHistoryRequestQueryParams = z.input<
  typeof listFailoverHistoryQueryParamsSchema
>;

export type ListFailoverHistoryResponse = ListFailoverHistoryResponseProto;

export type Context = DefaultMiddlewaresContext;
