'use client';
import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import getWorkflowFirstHistoryPageQueryOptions from '@/views/workflow-page/helpers/get-workflow-first-history-page-query-options';
import getWorkflowIsRunning from '@/views/workflow-page/helpers/get-workflow-is-running';
import getWorkflowSearchAttributes from '@/views/workflow-page/helpers/get-workflow-search-attributes';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';
import getWorkflowInputJson from '@/views/workflow-summary/helpers/get-workflow-input-json';
import getWorkflowResultJson from '@/views/workflow-summary/helpers/get-workflow-result-json';

import {
  type UseWorkflowInputResultParams,
  type UseWorkflowInputResultReturn,
} from './use-workflow-input-result.types';

/**
 * Loads a workflow's decoded input, result and search attributes.
 */
export default function useWorkflowInputResult({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowInputResultParams): UseWorkflowInputResultReturn {
  const history = useQuery(
    getWorkflowFirstHistoryPageQueryOptions({
      domain,
      cluster,
      workflowId,
      runId,
    })
  );

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
    return getWorkflowInputJson(startEvent);
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

  const isRunning = getWorkflowIsRunning(closeEvent);

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
