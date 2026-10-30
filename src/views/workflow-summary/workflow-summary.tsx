'use client';
import React from 'react';

import { useQuery } from '@tanstack/react-query';

import PageSection from '@/components/page-section/page-section';
import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatWorkflowHistory from '@/utils/data-formatters/format-workflow-history';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';
import decodeUrlParams from '@/utils/decode-url-params';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowFirstHistoryPageQueryOptions from '../workflow-page/helpers/get-workflow-first-history-page-query-options';
import getWorkflowIsRunning from '../workflow-page/helpers/get-workflow-is-running';
import getWorkflowSearchAttributes from '../workflow-page/helpers/get-workflow-search-attributes';
import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';

import getWorkflowInputJson from './helpers/get-workflow-input-json';
import getWorkflowIsError from './helpers/get-workflow-is-error';
import getWorkflowResultJson from './helpers/get-workflow-result-json';
import WorkflowSummaryDetails from './workflow-summary-details/workflow-summary-details';
import WorkflowSummaryDiagnosticsBanner from './workflow-summary-diagnostics-banner/workflow-summary-diagnostics-banner';
import WorkflowSummaryJsonView from './workflow-summary-json-view/workflow-summary-json-view';
import { type Props as JsonViewProps } from './workflow-summary-json-view/workflow-summary-json-view.types';
import WorkflowSummaryScheduleDetails from './workflow-summary-schedule-details/workflow-summary-schedule-details';
import { cssStyles } from './workflow-summary.styles';

export default function WorkflowSummary({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams =
    decodeUrlParams<WorkflowPageTabContentProps['params']>(params);
  const { workflowTab, ...paramsWithoutTab } = params;
  const { data: workflowHistory, isLoading: isWorkflowHistoryLoading } =
    useQuery({
      ...getWorkflowFirstHistoryPageQueryOptions(paramsWithoutTab),
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

  const isWorkflowRunning = getWorkflowIsRunning(closeEvent);

  const isWorkflowError =
    !!closeEvent?.attributes && getWorkflowIsError(closeEvent.attributes);

  const baseJsonViewProps: JsonViewProps = {
    inputJson: getWorkflowInputJson(formattedStartEvent),
    resultJson,
    isWorkflowRunning,
    isWorkflowError,
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
          <WorkflowSummaryScheduleDetails
            cluster={decodedParams.cluster}
            domain={decodedParams.domain}
            searchAttributes={getWorkflowSearchAttributes(
              workflowDetails.workflowExecutionInfo?.searchAttributes
                ?.indexedFields
            )}
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
