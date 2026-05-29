import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type RouteParams = {
  domain: string;
  cluster: string;
  batchActionId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type Context = DefaultMiddlewaresContext;
