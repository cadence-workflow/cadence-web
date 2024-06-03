'use client';
import React, { useEffect, useState } from 'react';
import formatPayload from '@/views/workflow-page/helpers/format-payload';
import { cssStyles } from './workflow-summary-tab.styles';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';
import WorkflowSummaryTabJsonView from './workflow-summary-tab-json-view/workflow-summary-tab-json-view';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';

export default function WorkflowSummaryTab({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);
  const [{ loading, error, data: workflowHistory }, setWorkflowHistory] =
    useState<{ loading: boolean; error: any; data: any }>({
      loading: true,
      error: null,
      data: null,
    });
  const workflowEvents = workflowHistory?.history?.events;

  useEffect(() => {
    fetch(
      `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/history`
    )
      .then((res) => res.json())
      .then((data) => {
        setWorkflowHistory({ data, error: null, loading: false });
      })
      .catch((error) => {
        setWorkflowHistory({ data: null, error, loading: false });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // propagate error to the closest error layout
  if (error) throw new Error(error);
  if (loading) return <SectionLoadingIndicator />;

  return (
    <div className={cls.pageContainer}>
      <div className={cls.mainContent}>
        <div>Summary section</div>
        <div>Taskslist</div>
      </div>
      <div className={cls.jsonArea}>
        <WorkflowSummaryTabJsonView
          inputJson={formatPayload(
            workflowEvents?.[0]?.workflowExecutionStartedEventAttributes?.input
          )}
          resultJson={{}}
        />
      </div>
    </div>
  );
}
