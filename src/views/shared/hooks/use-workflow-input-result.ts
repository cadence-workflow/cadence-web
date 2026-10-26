'use client';
import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import getWorkflowSearchAttributes from '@/views/shared/markdoc-workflow-payload/helpers/get-workflow-search-attributes';
import getWorkflowIsCompleted from '@/views/workflow-page/helpers/get-workflow-is-completed';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';
import getWorkflowResultJson from '@/views/workflow-summary/helpers/get-workflow-result-json';

import {
  type UseWorkflowInputResultParams,
  type UseWorkflowInputResultReturn,
} from './use-workflow-input-result.types';

/**
 * Loads a workflow's decoded input, result and search attributes.
 * Uses the same query keys as the workflow summary, so both share the cache.
 */
export default function useWorkflowInputResult({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowInputResultParams): UseWorkflowInputResultReturn {
  const historyParams = { domain, cluster, workflowId, runId, pageSize: 1 };

  const history = useQuery<
    GetWorkflowHistoryResponse,
    RequestError,
    GetWorkflowHistoryResponse,
    [string, typeof historyParams]
  >({
    queryKey: ['workflow_history', historyParams] as const,
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}/history?${queryString.stringify({ pageSize: p.pageSize })}`
      ).then((res) => res.json()),
  });

  const describe = useDescribeWorkflow({
    domain,
    cluster,
    workflowId,
    runId,
  });

  const input = useMemo<PrettyJsonValue>(() => {
    if (!history.data) return undefined;
    const startEvent = formatWorkflowHistory(history.data)?.history
      ?.events?.[0] as
      | FormattedHistoryEventForType<'WorkflowExecutionStarted'>
      | undefined;
    return startEvent && 'input' in startEvent
      ? (startEvent.input as PrettyJsonValue)
      : [];
  }, [history.data]);

  const closeEvent = describe.data?.workflowExecutionInfo?.closeEvent ?? null;

  const result = useMemo<PrettyJsonValue>(() => {
    const formattedCloseEvent = closeEvent
      ? formatWorkflowHistoryEvent(closeEvent)
      : null;
    return formattedCloseEvent
      ? (getWorkflowResultJson(formattedCloseEvent) as PrettyJsonValue)
      : undefined;
  }, [closeEvent]);

  const indexedFields =
    describe.data?.workflowExecutionInfo?.searchAttributes?.indexedFields;

  const searchAttributes = useMemo(
    () => getWorkflowSearchAttributes(indexedFields),
    [indexedFields]
  );

  const isRunning =
    !closeEvent ||
    !closeEvent.attributes ||
    !getWorkflowIsCompleted(closeEvent.attributes);

  return {
    input,
    result,
    searchAttributes,
    isRunning,
    isArchived: describe.data?.workflowExecutionInfo?.isArchived ?? false,
    isLoading: history.isLoading || describe.isLoading,
    error: history.error ?? describe.error ?? null,
  };
}
