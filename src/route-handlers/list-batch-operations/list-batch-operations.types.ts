import { type ListBatchOperationsResponse as ListBatchOperationsResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListBatchOperationsResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListBatchOperationsResponse = ListBatchOperationsResponseProto;

export type Context = DefaultMiddlewaresContext;
