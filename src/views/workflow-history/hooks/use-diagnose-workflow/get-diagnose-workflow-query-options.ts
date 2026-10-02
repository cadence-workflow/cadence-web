import queryString from 'query-string';

import request from '@/utils/request';

import {
  type DiagnoseWorkflowQueryOptions,
  type UseDiagnoseWorkflowParams,
} from './use-diagnose-workflow.types';

export default function getDiagnoseWorkflowQueryOptions(
  params: UseDiagnoseWorkflowParams
): DiagnoseWorkflowQueryOptions {
  return {
    queryKey: ['diagnoseWorkflow', params],
    queryFn: async ({
      queryKey: [_, { domain, cluster, workflowId, runId }],
    }: {
      queryKey: [string, UseDiagnoseWorkflowParams];
    }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}/diagnose`,
        })
      ).then((res) => res.json()),
  };
}
