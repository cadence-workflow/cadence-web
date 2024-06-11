import { type ZodIssue, z } from 'zod';
import listWorkflowsQueryParamSchema from './schemas/list-workflows-query-params-schema';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

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

export type ListWorkflowsResponse = {
  workflows: Array<DomainWorkflow>;
  // TODO @adhitya.mamallan - use the Byte[] type from Protobuf when it is available
  nextPage: any;
};

export type ListWorkflowsError = {
  error: string;
  validationErrors?: Array<ZodIssue>;
  message?: string;
};
