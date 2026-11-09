import queryString from 'query-string';

import request from '@/utils/request';

import {
  type WorkflowFirstHistoryPageQueryKey,
  type WorkflowFirstHistoryPageQueryOptions,
  type WorkflowFirstHistoryPageQueryParams,
} from './get-workflow-first-history-page-query-options.types';

export default function getWorkflowFirstHistoryPageQueryOptions({
  domain,
  cluster,
  workflowId,
  runId,
}: WorkflowFirstHistoryPageQueryParams): WorkflowFirstHistoryPageQueryOptions {
  return {
    queryKey: [
      'workflow_history',
      { domain, cluster, workflowId, runId, pageSize: 1 },
    ] satisfies WorkflowFirstHistoryPageQueryKey,
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}/history?${queryString.stringify({ pageSize: p.pageSize })}`
      ).then((res) => res.json()),
  };
}
