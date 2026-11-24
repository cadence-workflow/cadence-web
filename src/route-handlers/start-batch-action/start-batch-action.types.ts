import { type z } from 'zod';

import { type StartBatchOperationResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartBatchOperationResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type startBatchActionRequestBodySchema from './schemas/start-batch-action-request-body-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type StartBatchActionRequestBody = z.infer<
  typeof startBatchActionRequestBodySchema
>;

export type StartBatchActionResponse = StartBatchOperationResponse;

export type Context = DefaultMiddlewaresContext;
