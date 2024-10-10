'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import decodeUrlParams from '@/utils/decode-url-params';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowIsCompleted from '../workflow-page/helpers/get-workflow-is-completed';

import WorkflowSummaryTabDetails from './workflow-summary-tab-details/workflow-summary-tab-details';
import WorkflowSummaryTabJsonView from './workflow-summary-tab-json-view/workflow-summary-tab-json-view';
import { cssStyles } from './workflow-summary-tab.styles';

export default function WorkflowSummaryTab({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams =
    decodeUrlParams<WorkflowPageTabContentProps['params']>(params);
  const { workflowTab, ...historyQueryParams } = params;
  const { data: workflowHistory } = useSuspenseQuery<
    GetWorkflowHistoryResponse,
    RequestError,
    GetWorkflowHistoryResponse,
    [string, typeof historyQueryParams]
  >({
    queryKey: ['workflow_history', historyQueryParams] as const,
    queryFn: ({ queryKey: [_, qp] }) =>
      request(
        `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history?${queryString.stringify({ pageSize: 600 })}`
      ).then((res) => res.json()),
  });
  const historyEvents = workflowHistory?.history?.events || [];
  const firstEvent = historyEvents[0];
  const lastEvent = historyEvents[historyEvents.length - 1];
  const formattedWorkflowHistory = formatWorkflowHistory(workflowHistory);
  const workflowEvents = formattedWorkflowHistory?.history?.events;
  const formattedStartEvent = formattedWorkflowHistory?.history
    ?.events?.[0] as FormattedHistoryEventForType<'WorkflowExecutionStarted'>;

  const formattedLastEvent = workflowEvents?.[workflowEvents.length - 1];
  const formattedCloseEvent = getWorkflowIsCompleted(lastEvent?.attributes)
    ? formattedLastEvent
    : null;

  const resultJson =
    formattedCloseEvent && 'result' in formattedCloseEvent
      ? formattedCloseEvent.result
      : undefined;

  return (
    <PageSection>
      <div className={cls.pageContainer}>
        <div className={cls.mainContent}>
          <WorkflowSummaryTabDetails
            firstHistoryEvent={firstEvent}
            lastHistoryEvent={lastEvent}
            formattedFirstHistoryEvent={formattedStartEvent}
            formattedCloseHistoryEvent={formattedCloseEvent}
            decodedPageUrlParams={decodedParams}
          />
          {/*  <div>Taskslist</div> */}
        </div>
        <div className={cls.jsonArea}>
          <WorkflowSummaryTabJsonView
            inputJson={
              formattedStartEvent && 'input' in formattedStartEvent
                ? formattedStartEvent?.input
                : []
            }
            resultJson={resultJson}
          />
        </div>
      </div>
    </PageSection>
  );
}
