import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import parseErrorMessageForQueryTypes from '@/route-handlers/fetch-workflow-query-types/helpers/parse-error-message-for-query-types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  WORKFLOW_HOME_QUERY_MAX_RETRIES,
  WORKFLOW_HOME_QUERY_NAME,
  WORKFLOW_HOME_QUERY_RETRY_DELAY_MS,
} from '../workflow-home.constants';

import {
  type UseWorkflowHomeQueryOptions,
  type UseWorkflowHomeQueryParams,
} from './use-workflow-home-query.types';

export default function useWorkflowHomeQuery(
  { domain, cluster, workflowId, runId }: UseWorkflowHomeQueryParams,
  { enabled, refetchInterval = false }: UseWorkflowHomeQueryOptions
): UseQueryResult<QueryWorkflowResponse, RequestError> {
  return useQuery<QueryWorkflowResponse, RequestError>({
    // Same key shape as the Queries tab, so both tabs share the cached result.
    queryKey: [
      'workflow_query',
      { workflowId, runId, name: WORKFLOW_HOME_QUERY_NAME },
      undefined,
    ],
    queryFn: () =>
      request(
        `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query/${WORKFLOW_HOME_QUERY_NAME}`,
        { method: 'POST' }
      ).then((res) => res.json()),
    enabled,
    // A missing query handler will not appear on retry or on the next poll,
    // so only retry and poll after other errors
    retry: (failureCount, error) =>
      !parseErrorMessageForQueryTypes(error.message) &&
      failureCount < WORKFLOW_HOME_QUERY_MAX_RETRIES,
    retryDelay: WORKFLOW_HOME_QUERY_RETRY_DELAY_MS,
    refetchInterval: (query) =>
      query.state.error &&
      parseErrorMessageForQueryTypes(query.state.error.message)
        ? false
        : refetchInterval,
  });
}
