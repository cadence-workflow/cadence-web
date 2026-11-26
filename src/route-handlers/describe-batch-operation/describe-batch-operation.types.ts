import { type DescribeBatchOperationResponse as DescribeBatchOperationResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeBatchOperationResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  batchId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeBatchOperationResponse =
  DescribeBatchOperationResponseProto;

export type Context = DefaultMiddlewaresContext;
