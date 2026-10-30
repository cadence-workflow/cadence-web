'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import getDescribeWorkflowQueryOptions from './get-describe-workflow-query-options';
import { type UseSuspenseQueryDescribeWorkflowParams } from './use-describe-workflow.types';

export default function useSuspenseDescribeWorkflow({
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
