import { type z } from 'zod';

import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type getWorkflowHistoryQueryParamsSchema from './schemas/get-workflow-history-query-params-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type WorkflowHistoryQueryParams = z.infer<
  typeof getWorkflowHistoryQueryParamsSchema
>;

export type GetWorkflowHistoryResponse = GetWorkflowExecutionHistoryResponse;

export type Context = DefaultMiddlewaresContext;
