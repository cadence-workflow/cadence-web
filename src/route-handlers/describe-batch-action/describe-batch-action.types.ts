import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type RouteParams = {
  domain: string;
  cluster: string;
  batchActionId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeBatchActionResponse = BatchAction;

export type BatcherInputFields = Pick<
  BatchAction,
  'actionType' | 'rps' | 'concurrency'
>;

export type Context = DefaultMiddlewaresContext;
