'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import CadenceMarkdown from '@/views/shared/cadence-markdown/cadence-markdown';

import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowHomeContent from './helpers/get-workflow-home-content';
import useWorkflowHomeQuery from './hooks/use-workflow-home-query';
import WorkflowHomeEmpty from './workflow-home-empty/workflow-home-empty';
import WorkflowHomeHeader from './workflow-home-header/workflow-home-header';
import {
  WORKFLOW_HOME_ACTION_REFETCH_DELAY_MS,
  WORKFLOW_HOME_MESSAGES,
  WORKFLOW_HOME_REFRESH_INTERVAL_MS,
} from './workflow-home.constants';

export default function WorkflowHome({ params }: WorkflowPageTabContentProps) {
  const { domain, cluster, workflowId, runId } = params;

  const { data: isHomeEnabled } = useSuspenseConfigValue(
    'WORKFLOW_HOME_ENABLED'
  );

  const { data: workflowDetails, isLoading: isDetailsLoading } =
    useDescribeWorkflow({ domain, cluster, workflowId, runId });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;
  // Same check as useDescribeWorkflow, which keeps polling until the workflow closes
  const closeStatus = workflowDetails?.workflowExecutionInfo?.closeStatus;
  const isRunning =
    !closeStatus || closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const homeQuery = useWorkflowHomeQuery(
    { domain, cluster, workflowId, runId },
    {
      enabled: isHomeEnabled && !isArchived && !isDetailsLoading,
      // Pauses on its own while the browser tab is hidden
      refetchInterval: isRunning ? WORKFLOW_HOME_REFRESH_INTERVAL_MS : false,
    }
  );

  // The worker may not have handled a signal yet when the first refetch runs,
  // so refetch once more after a short delay.
  const { refetch: refetchHome } = homeQuery;
  const delayedRefetchRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(delayedRefetchRef.current), []);
  const handleActionSuccess = useCallback(() => {
    refetchHome();
    clearTimeout(delayedRefetchRef.current);
    delayedRefetchRef.current = setTimeout(
      refetchHome,
      WORKFLOW_HOME_ACTION_REFETCH_DELAY_MS
    );
  }, [refetchHome]);

  // Spin only for manual refreshes, not for background polling
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsManualRefresh(true);
    await refetchHome();
    setIsManualRefresh(false);
  }, [refetchHome]);

  const content = getWorkflowHomeContent({
    isEnabled: isHomeEnabled,
    isArchived,
    homeQuery: {
      data: homeQuery.data,
      error: homeQuery.error,
      isLoading: homeQuery.isLoading,
    },
  });

  if (isDetailsLoading || content.mode === 'loading') {
    return <SectionLoadingIndicator />;
  }

  switch (content.mode) {
    case 'disabled':
      return (
        <ErrorPanel omitLogging message={WORKFLOW_HOME_MESSAGES.disabled} />
      );
    case 'archived':
      return (
        <ErrorPanel omitLogging message={WORKFLOW_HOME_MESSAGES.archived} />
      );
    case 'not-set-up':
      return <WorkflowHomeEmpty />;
    case 'error':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_HOME_MESSAGES.error}
          description={content.description}
          actions={[
            {
              kind: 'callback',
              label: 'Retry',
              onClick: () => refetchHome(),
              buttonKind: 'secondary',
            },
          ]}
        />
      );
    case 'invalid-format':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_HOME_MESSAGES.invalidFormat}
          description={content.description}
        />
      );
    case 'ready':
      return (
        <>
          <PageSection>
            <WorkflowHomeHeader
              title={content.title}
              onRefresh={handleRefresh}
              isRefreshing={isManualRefresh}
            />
          </PageSection>
          <PageSection>
            <CadenceMarkdown
              markdown={content.content}
              domain={domain}
              cluster={cluster}
              workflowId={workflowId}
              runId={runId}
              onActionSuccess={handleActionSuccess}
            />
          </PageSection>
        </>
      );
    default:
      return null;
  }
}
