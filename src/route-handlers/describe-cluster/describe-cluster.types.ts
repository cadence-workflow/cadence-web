import { type DescribeClusterResponse as OriginalDescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type Context = DefaultMiddlewaresContext;
export type DescribeClusterResponse = Omit<
  OriginalDescribeClusterResponse,
  'membershipInfo'
>;
