'use client';
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import PageSection from '@/components/page-section/page-section';
import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
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
import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';

import getWorkflowResultJson from './helpers/get-workflow-result-json';
import WorkflowSummaryDetails from './workflow-summary-details/workflow-summary-details';
import WorkflowSummaryDiagnosticsBanner from './workflow-summary-diagnostics-banner/workflow-summary-diagnostics-banner';
import WorkflowSummaryJsonView from './workflow-summary-json-view/workflow-summary-json-view';
import { type Props as JsonViewProps } from './workflow-summary-json-view/workflow-summary-json-view.types';
import { cssStyles } from './workflow-summary.styles';

export default function WorkflowSummary({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams =
    decodeUrlParams<WorkflowPageTabContentProps['params']>(params);
  const { workflowTab, ...paramsWithoutTab } = params;
  const historyParams = { ...paramsWithoutTab, pageSize: 1 };
  const { data: workflowHistory, isLoading: isWorkflowHistoryLoading } =
    useQuery<
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
      throwOnError: true,
    });

  const { data: workflowDetails, isLoading: isWorkflowDetailsLoading } =
    useDescribeWorkflow({
      ...paramsWithoutTab,
      throwOnError: true,
    });

  if (isWorkflowHistoryLoading || isWorkflowDetailsLoading) {
    return <SectionLoadingIndicator />;
  }
  // Should never happen as we have throwOnError set to true but it is for better type safety below
  if (!workflowDetails || !workflowHistory) {
    throw new Error('Workflow details or history not found');
  }

  const historyEvents = workflowHistory?.history?.events || [];
  const firstEvent = historyEvents[0];
  const closeEvent = workflowDetails.workflowExecutionInfo?.closeEvent || null;
  const isArchived = workflowDetails.workflowExecutionInfo?.isArchived || false;
  const formattedWorkflowHistory = formatWorkflowHistory(workflowHistory);
  const formattedStartEvent = formattedWorkflowHistory?.history
    ?.events?.[0] as FormattedHistoryEventForType<'WorkflowExecutionStarted'>;

  const formattedCloseEvent = closeEvent
    ? formatWorkflowHistoryEvent(closeEvent)
    : null;

  const resultJson = (
    formattedCloseEvent ? getWorkflowResultJson(formattedCloseEvent) : undefined
  ) as PrettyJsonValue;

  const isWorkflowRunning =
    !closeEvent ||
    !closeEvent.attributes ||
    !getWorkflowIsCompleted(closeEvent.attributes);

  const baseJsonViewProps: JsonViewProps = {
    inputJson:
      formattedStartEvent && 'input' in formattedStartEvent
        ? (formattedStartEvent?.input as PrettyJsonValue)
        : [],
    resultJson,
    isWorkflowRunning,
    isArchived,
    ...params,
  };

  return (
    <PageSection>
      <div className={cls.pageContainer}>
        <div className={cls.mainContent}>
          <WorkflowSummaryDiagnosticsBanner {...params} />
          <WorkflowSummaryDetails
            firstHistoryEvent={firstEvent}
            closeHistoryEvent={closeEvent}
            formattedFirstHistoryEvent={formattedStartEvent}
            formattedCloseHistoryEvent={formattedCloseEvent}
            workflowDetails={workflowDetails}
            decodedPageUrlParams={decodedParams}
          />
        </div>
        {/* On narrow screens */}
        <div className={cls.jsonPanel}>
          <WorkflowSummaryJsonView
            {...baseJsonViewProps}
            defaultTab={isWorkflowRunning ? 'input' : 'result'}
          />
        </div>
        {/* On wide screens */}
        <div className={cls.jsonPanelWide}>
          <WorkflowSummaryJsonView
            {...baseJsonViewProps}
            defaultTab="input"
            hideTabToggle
          />
        </div>
        <div className={cls.jsonPanelWide}>
          <WorkflowSummaryJsonView
            {...baseJsonViewProps}
            defaultTab="result"
            hideTabToggle
          />
        </div>
      </div>
    </PageSection>
  );
}
