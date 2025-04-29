import {
  type UseSuspenseQueryOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseDescribeWorkflowQueryOptions =
  | UseSuspenseQueryOptions<
      DescribeWorkflowResponse,
      RequestError,
      DescribeWorkflowResponse,
      DescribeWorkflowQueryKey
    >
  | UseQueryOptions<
      DescribeWorkflowResponse,
      RequestError,
      DescribeWorkflowResponse,
      DescribeWorkflowQueryKey
    >;

export type UseDescribeWorkflowParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  refetchInterval?: number;
};

export type UseSuspenseQueryDescribeWorkflowParams = UseDescribeWorkflowParams &
  Partial<
    UseSuspenseQueryOptions<
      DescribeWorkflowResponse,
      RequestError,
      DescribeWorkflowResponse,
      DescribeWorkflowQueryKey
    >
  >;

export type UseQueryDescribeWorkflowParams = UseDescribeWorkflowParams &
  Partial<
    UseQueryOptions<
      DescribeWorkflowResponse,
      RequestError,
      DescribeWorkflowResponse,
      DescribeWorkflowQueryKey
    >
  >;

export type DescribeWorkflowQueryKey = [
  'describe_workflow',
  Omit<UseDescribeWorkflowParams, 'refetchInterval'>,
];
