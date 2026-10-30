import { queryOptions } from '@tanstack/react-query';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import WORKFLOW_PAGE_STATUS_REFETCH_INTERVAL from '../../config/workflow-page-status-refetch-interval.config';

import {
  type DescribeWorkflowQueryKey,
  type UseDescribeWorkflowParams,
} from './use-describe-workflow.types';

export default function getDescribeWorkflowQueryOptions({
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
