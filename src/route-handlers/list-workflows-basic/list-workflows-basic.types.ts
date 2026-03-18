import { type z, type ZodIssue } from 'zod';

import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

import { type WorkflowListItem } from '../list-workflows/list-workflows.types';

import type listWorkflowsBasicQueryParamsSchema from './schemas/list-workflows-basic-query-params-schema';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};
export type ListWorkflowsBasicResponse = {
  workflows: Array<WorkflowListItem>;
  nextPage: string;
};

export type ListWorkflowsBasicError = {
  error: string;
  validationErrors?: Array<ZodIssue>;
  message?: string;
};

export type ListWorkflowsBasicRequestQueryParams = z.input<
  typeof listWorkflowsBasicQueryParamsSchema
>;

export type Context = DefaultMiddlewaresContext;
