import { type z } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import { type BATCH_ACTION_TYPE } from './describe-batch-action.constants';
import type heartbeatDetailsSchema from './schemas/heartbeat-details-schema';

// Derived from the constant so the two never drift; BATCH_ACTION_TYPE is the
// single source of truth.
export type BatchActionType = keyof typeof BATCH_ACTION_TYPE;

export type BatchActionProgress = z.infer<typeof heartbeatDetailsSchema>;

// Outcome of reading progress from a heartbeat payload. `progressError` is set
// when a payload was present but did not match the expected heartbeat shape (as
// opposed to simply being absent, which leaves both fields undefined).
export type BatchActionProgressResult = {
  progress?: BatchActionProgress;
  progressError?: boolean;
};

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeBatchActionResponse = BatchAction;

export type BatcherInputFields = Pick<BatchAction, 'actionType' | 'rps'>;

export type Context = DefaultMiddlewaresContext;
