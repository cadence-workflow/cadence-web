'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import WORKFLOW_PAGE_STATUS_REFETCH_INTERVAL from '../config/workflow-page-status-refetch-interval.config';

import {
  type UseSuspenseQueryDescribeWorkflowParams,
  type DescribeWorkflowQueryKey,
  type UseDescribeWorkflowParams,
  type UseQueryDescribeWorkflowParams,
  type UseDescribeWorkflowQueryOptions,
} from './use-describe-workflow.types';

const getDefaultConfigurations = ({
  domain,
  cluster,
  workflowId,
  runId,
  refetchInterval = WORKFLOW_PAGE_STATUS_REFETCH_INTERVAL,
  ...queryOptions
}: UseDescribeWorkflowParams): UseDescribeWorkflowQueryOptions => ({
  queryKey: [
    'describe_workflow',
    { domain, cluster, workflowId, runId },
  ] as DescribeWorkflowQueryKey,
  queryFn: ({ queryKey: [_, p] }: { queryKey: DescribeWorkflowQueryKey }) =>
    request(
      `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}`
    ).then((res) => res.json()),
  refetchInterval: (query: { state: { data?: DescribeWorkflowResponse } }) => {
    const { closeStatus } = query.state.data?.workflowExecutionInfo || {};
    if (
      !closeStatus ||
      closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
    )
      return refetchInterval;

    return false;
  },
  ...queryOptions,
});

export function useDescribeWorkflow(params: UseQueryDescribeWorkflowParams) {
  return useQuery<
    DescribeWorkflowResponse,
    RequestError,
    DescribeWorkflowResponse,
    DescribeWorkflowQueryKey
  >(getDefaultConfigurations(params));
}

export function useSuspenseDescribeWorkflow(
  params: UseSuspenseQueryDescribeWorkflowParams
) {
  return useSuspenseQuery<
    DescribeWorkflowResponse,
    RequestError,
    DescribeWorkflowResponse,
    DescribeWorkflowQueryKey
  >(getDefaultConfigurations(params));
}
