'use client';

import { useQuery } from '@tanstack/react-query';

import getDescribeWorkflowQueryOptions from './get-describe-workflow-query-options';
import { type UseQueryDescribeWorkflowParams } from './use-describe-workflow.types';

export default function useDescribeWorkflow({
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
