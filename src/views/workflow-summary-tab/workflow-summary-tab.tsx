'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
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
        `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history`
      ).then((res) => res.json()),
  });
  const formattedWorkflowHistory = formatWorkflowHistory(workflowHistory);
  const workflowEvents = formattedWorkflowHistory?.history?.events;
  const formattedStartEvent = formattedWorkflowHistory?.history?.events?.[0];

  const formattedLastEvent = workflowEvents?.[workflowEvents.length - 1];
  const formattedCompletedEvent = getWorkflowIsCompleted(
    formattedLastEvent?.attributes
  )
    ? formattedLastEvent
    : undefined;

  const resultJson = formattedCompletedEvent
    ? formattedCompletedEvent[formattedCompletedEvent.attributes]
    : undefined;

  return (
    <div className={cls.pageContainer}>
      <div className={cls.mainContent}>
        <WorkflowSummaryTabDetails
          firstHistoryEvent={formattedStartEvent}
          lastHistoryEvent={formattedLastEvent}
          params={params}
        />
        {/*  <div>Taskslist</div> */}
      </div>
      <div className={cls.jsonArea}>
        <WorkflowSummaryTabJsonView
          inputJson={
            formattedStartEvent?.[formattedStartEvent.attributes]?.input
          }
          resultJson={resultJson}
        />
      </div>
    </div>
  );
}
