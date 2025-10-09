import { type GetSearchAttributesResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetSearchAttributesResponse';
import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';

/**
 * Search attributes category types
 */
export type SearchAttributesCategory = 'all' | 'system' | 'custom';

/**
 * Search attributes response with category filtering applied to keys
 */
export type SearchAttributesResponse = GetSearchAttributesResponse & {
  category: SearchAttributesCategory;
};

export type Context = {
  grpcClusterMethods: GRPCClusterMethods;
};

export type RouteParams = {
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};
