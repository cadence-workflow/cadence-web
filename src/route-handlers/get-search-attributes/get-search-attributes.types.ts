import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';

export { type GetSearchAttributesResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetSearchAttributesResponse';

export type SearchAttributesCategory = 'all' | 'system' | 'custom';

export type Context = {
  grpcClusterMethods: GRPCClusterMethods;
};

export type RouteParams = {
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};
