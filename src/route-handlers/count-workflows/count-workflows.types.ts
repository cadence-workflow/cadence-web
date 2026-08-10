import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type CountWorkflowsResponse = {
  count: number;
};

export type Context = DefaultMiddlewaresContext;
