import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import { type BATCH_ACTION_TYPE } from './describe-batch-action.constants';

// Derived from the constant so the two never drift; BATCH_ACTION_TYPE is the
// single source of truth.
export type BatchActionType = keyof typeof BATCH_ACTION_TYPE;

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
