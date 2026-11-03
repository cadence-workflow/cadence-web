'use client';
import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import getWorkflowFirstHistoryPageQueryOptions from '@/views/workflow-page/helpers/get-workflow-first-history-page-query-options';
import getWorkflowIsRunning from '@/views/workflow-page/helpers/get-workflow-is-running';
import getDescribeWorkflowQueryOptions from '@/views/workflow-page/hooks/use-describe-workflow/get-describe-workflow-query-options';
import getWorkflowInputJson from '@/views/workflow-summary/helpers/get-workflow-input-json';
import getWorkflowResultJson from '@/views/workflow-summary/helpers/get-workflow-result-json';

import {
  type UseWorkflowPayloadsParams,
  type UseWorkflowPayloadsReturn,
} from './use-workflow-payloads.types';

export default function useWorkflowPayloads({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowPayloadsParams): UseWorkflowPayloadsReturn {
  const [history, describe] = useQueries({
    queries: [
      getWorkflowFirstHistoryPageQueryOptions({
        domain,
        cluster,
        workflowId,
        runId,
      }),
      getDescribeWorkflowQueryOptions({
        domain,
        cluster,
        workflowId,
        runId,
      }),
    ],
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

  const searchAttributesPayloads =
    describe.data?.workflowExecutionInfo?.searchAttributes;

  const searchAttributes = useMemo<
    UseWorkflowPayloadsReturn['searchAttributes']
  >(
    () =>
      formatPayloadMap(searchAttributesPayloads, 'indexedFields')
        ?.indexedFields,
    [searchAttributesPayloads]
  );

  return {
    input,
    result,
    searchAttributes,
    isRunning: getWorkflowIsRunning(closeEvent?.attributes),
    isArchived: describe.data?.workflowExecutionInfo?.isArchived ?? false,
    isLoading: history.isLoading || describe.isLoading,
    error: history.error ?? describe.error ?? null,
  };
}
