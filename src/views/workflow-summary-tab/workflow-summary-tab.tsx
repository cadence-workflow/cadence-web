'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import formatWorkflowInputPayload from '@/utils/data-formatters/format-workflow-input-payload';
import request from '@/utils/request';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowSummaryTabJsonView from './workflow-summary-tab-json-view/workflow-summary-tab-json-view';
import { cssStyles } from './workflow-summary-tab.styles';

export default function WorkflowSummaryTab({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);

  const { data: workflowHistory } = useSuspenseQuery({
    queryKey: ['workflow_history'],
    queryFn: () =>
      request(
        `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/history`
      ).then((res) => res.json()),
  });
  const workflowEvents = workflowHistory?.history?.events;

  const lastEvent = workflowEvents?.[workflowEvents.length - 1];
  const workflowCompletedEvent =
    lastEvent && lastEvent.attributes?.startsWith('workflowExecution')
      ? lastEvent
      : undefined;
  const formattedCompletedEvent = workflowCompletedEvent
    ? formatWorkflowHistoryEvent(workflowCompletedEvent)
    : undefined;
  const resultJson = formattedCompletedEvent
    ? formattedCompletedEvent[lastEvent.attributes]
    : undefined;

  return (
    <div className={cls.pageContainer}>
      <div className={cls.mainContent}>
        <div>Summary section</div>
        <div>Taskslist</div>
      </div>
      <div className={cls.jsonArea}>
        <WorkflowSummaryTabJsonView
          inputJson={formatWorkflowInputPayload(
            workflowEvents?.[0]?.workflowExecutionStartedEventAttributes?.input
          )}
          resultJson={resultJson}
        />
      </div>
    </div>
  );
}
