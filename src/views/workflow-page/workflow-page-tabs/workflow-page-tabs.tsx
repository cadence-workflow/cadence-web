'use client';
import React, { useMemo } from 'react';

import omit from 'lodash/omit';
import { useRouter, useParams } from 'next/navigation';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';
import useConfigGatedTabs from '@/views/shared/hooks/use-config-gated-tabs';
import WorkflowActions from '@/views/workflow-actions/workflow-actions';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import WorkflowPageCliCommandsButton from '../workflow-page-cli-commands-button/workflow-page-cli-commands-button';

import { styled } from './workflow-page-tabs.styles';
import type { WorkflowPageTabsParams } from './workflow-page-tabs.types';

export default function WorkflowPageTabs() {
  const router = useRouter();
  const params = useParams<WorkflowPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as WorkflowPageTabsParams;

  const { tabsToHide } = useConfigGatedTabs([
    {
      tab: 'diagnostics',
      title: workflowPageTabsConfig.diagnostics.title,
      key: 'WORKFLOW_DIAGNOSTICS_ENABLED',
    },
  ]);

  const filteredTabsConfig = useMemo(
    () => omit(workflowPageTabsConfig, tabsToHide),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabsToHide.join(',')]
  );

  const tabList = useMemo(
    () =>
      Object.entries(filteredTabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
        endEnhancer: tabConfig.endEnhancer,
      })),
    [filteredTabsConfig]
  );

  return (
    <PageTabs
      selectedTab={decodedParams.workflowTab}
      tabList={tabList}
      setSelectedTab={(newTab) => {
        router.push(encodeURIComponent(newTab.toString()));
      }}
      endEnhancer={
        <styled.EndButtonsContainer>
          <WorkflowPageCliCommandsButton />
          <ErrorBoundary fallbackRender={() => null}>
            <WorkflowActions />
          </ErrorBoundary>
        </styled.EndButtonsContainer>
      }
    />
  );
}
