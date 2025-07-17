import { type UseQueryOptions } from '@tanstack/react-query';
import queryString from 'query-string';

import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseDiagnoseWorkflowParams } from './use-diagnose-workflow.types';

export default function getDiagnoseWorkflowQueryOptions(
  params: UseDiagnoseWorkflowParams
): UseQueryOptions<
  DiagnoseWorkflowResponse,
  RequestError,
  DiagnoseWorkflowResponse,
  [string, UseDiagnoseWorkflowParams]
> {
  return {
    queryKey: ['diagnoseWorkflow', params],
    queryFn: async ({
      queryKey: [_, { domain, cluster, workflowId, runId }],
    }: {
      queryKey: [string, UseDiagnoseWorkflowParams];
    }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/diagnose`,
        })
      ).then((res) => res.json()),
  };
}
