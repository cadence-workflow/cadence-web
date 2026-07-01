'use client';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type UseWorkflowStartedEventParams,
  type WorkflowStartedEvent,
} from './use-workflow-started-event.types';

// Mirrors how the workflow summary tab loads the started event: fetch the first
// history event (pageSize 1) and run it through formatWorkflowHistory, which
// decodes the payload fields (input, memo, searchAttributes, header). Same query
// key as the summary so the two share a cache entry.
export default function useWorkflowStartedEvent({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowStartedEventParams): {
  startedEvent: WorkflowStartedEvent | undefined;
  isLoading: boolean;
} {
  const historyParams = { domain, cluster, workflowId, runId, pageSize: 1 };

  const { data, isLoading } = useQuery<
    GetWorkflowHistoryResponse,
    RequestError,
    GetWorkflowHistoryResponse,
    ['workflow_history', typeof historyParams]
  >({
    queryKey: ['workflow_history', historyParams],
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}/history?${queryString.stringify(
          { pageSize: p.pageSize }
        )}`
      ).then((res) => res.json()),
  });

  const firstEvent = data && formatWorkflowHistory(data).history.events[0];

  const startedEvent =
    firstEvent && firstEvent.eventType === 'WorkflowExecutionStarted'
      ? firstEvent
      : undefined;

  return { startedEvent, isLoading };
}
