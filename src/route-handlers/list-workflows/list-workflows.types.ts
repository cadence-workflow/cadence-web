import { type ZodIssue, type z } from 'zod';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import type listWorkflowsQueryParamSchema from './schemas/list-workflows-query-params-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ListWorkflowsRequestQueryParams = z.input<
  typeof listWorkflowsQueryParamSchema
>;

export type TimeColumn = ListWorkflowsRequestQueryParams['timeColumn'];

export type ListWorkflowsResponse = {
  workflows: Array<WorkflowListItem>;
  nextPage: string;
};

export type ListWorkflowsError = {
  error: string;
  validationErrors?: Array<ZodIssue>;
  message?: string;
};

// Fields based on Cadence's default search attributes for workflow execution visibility
// Reference: https://github.com/cadence-workflow/cadence/blob/master/common/definition/indexedKeys.go
export type WorkflowListItem = {
  workflowID: string;
  runID: string;
  workflowName: string;
  status: WorkflowExecutionCloseStatus;
  startTime: number;
  executionTime: number | undefined;
  updateTime: number | undefined;
  closeTime: number | undefined;
  historyLength: number;
  taskList: string;
  isCron: boolean;
  clusterAttributeScope: string | undefined;
  clusterAttributeName: string | undefined;
  searchAttributes?: Record<string, unknown>;
};

export type Context = DefaultMiddlewaresContext;
