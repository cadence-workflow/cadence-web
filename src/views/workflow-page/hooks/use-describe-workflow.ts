'use client';

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import WORKFLOW_PAGE_STATUS_REFETCH_INTERVAL from '../config/workflow-page-status-refetch-interval.config';

import {
  type UseSuspenseQueryDescribeWorkflowParams,
  type DescribeWorkflowQueryKey,
  type UseDescribeWorkflowParams,
  type UseQueryDescribeWorkflowParams,
} from './use-describe-workflow.types';

function getDescribeWorkflowQueryOptions({
  domain,
  cluster,
  workflowId,
  runId,
  refetchInterval = WORKFLOW_PAGE_STATUS_REFETCH_INTERVAL,
}: UseDescribeWorkflowParams) {
  return queryOptions<
    DescribeWorkflowResponse,
    RequestError,
    DescribeWorkflowResponse,
    DescribeWorkflowQueryKey
  >({
    queryKey: ['describe_workflow', { domain, cluster, workflowId, runId }],
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}`
      ).then((res) => res.json()),
    refetchInterval: (query) => {
      const { closeStatus } = query.state.data?.workflowExecutionInfo || {};
      if (
        !closeStatus ||
        closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
      )
        return refetchInterval;

      return false;
    },
  });
}

export function useDescribeWorkflow({
  domain,
  cluster,
  workflowId,
  runId,
  refetchInterval,
  ...queryOpts
}: UseQueryDescribeWorkflowParams) {
  return useQuery({
    ...getDescribeWorkflowQueryOptions({
      domain,
      cluster,
      workflowId,
      runId,
      refetchInterval,
    }),
    ...queryOpts,
  });
}

export function useSuspenseDescribeWorkflow({
  domain,
  cluster,
  workflowId,
  runId,
  refetchInterval,
  ...queryOpts
}: UseSuspenseQueryDescribeWorkflowParams) {
  return useSuspenseQuery({
    ...getDescribeWorkflowQueryOptions({
      domain,
      cluster,
      workflowId,
      runId,
      refetchInterval,
    }),
    ...queryOpts,
  });
}
