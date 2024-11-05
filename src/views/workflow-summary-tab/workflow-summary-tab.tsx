'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import decodeUrlParams from '@/utils/decode-url-params';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowIsCompleted from '../workflow-page/helpers/get-workflow-is-completed';
import useDescribeWorkflow from '../workflow-page/hooks/use-describe-workflow';

import getWorkflowResultJson from './helpers/get-workflow-result-json';
import WorkflowSummaryTabDetails from './workflow-summary-tab-details/workflow-summary-tab-details';
import WorkflowSummaryTabJsonView from './workflow-summary-tab-json-view/workflow-summary-tab-json-view';
import { cssStyles } from './workflow-summary-tab.styles';

export default function WorkflowSummaryTab({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams =
    decodeUrlParams<WorkflowPageTabContentProps['params']>(params);
  const { workflowTab, ...paramsWithoutTab } = params;
  const historyParams = { ...paramsWithoutTab, pageSize: 1 };
  const { data: workflowHistory } = useSuspenseQuery<
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

  const { data: workflowDetails } = useDescribeWorkflow({
    ...paramsWithoutTab,
  });

  const historyEvents = workflowHistory?.history?.events || [];
  const firstEvent = historyEvents[0];
  const closeEvent = workflowDetails.workflowExecutionInfo?.closeEvent || null;
  const formattedWorkflowHistory = formatWorkflowHistory(workflowHistory);
  const formattedStartEvent = formattedWorkflowHistory?.history
    ?.events?.[0] as FormattedHistoryEventForType<'WorkflowExecutionStarted'>;

  const formattedCloseEvent = closeEvent
    ? formatWorkflowHistoryEvent(closeEvent)
    : null;

  const resultJson = formattedCloseEvent
    ? getWorkflowResultJson(formattedCloseEvent)
    : undefined;

  const isWorkflowRunning =
    !closeEvent ||
    !closeEvent.attributes ||
    !getWorkflowIsCompleted(closeEvent.attributes);

  return (
    <PageSection>
      <div className={cls.pageContainer}>
        <div className={cls.mainContent}>
          <WorkflowSummaryTabDetails
            firstHistoryEvent={firstEvent}
            closeHistoryEvent={closeEvent}
            formattedFirstHistoryEvent={formattedStartEvent}
            formattedCloseHistoryEvent={formattedCloseEvent}
            workflowDetails={workflowDetails}
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
            isWorkflowRunning={isWorkflowRunning}
          />
        </div>
      </div>
    </PageSection>
  );
}
