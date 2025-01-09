'use client';
import React from 'react';

import { useRouter, useParams } from 'next/navigation';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import WorkflowPageActionsButton from '../workflow-page-actions-button/workflow-page-actions-button';
import WorkflowPageCliCommandsButton from '../workflow-page-cli-commands-button/workflow-page-cli-commands-button';

import { styled } from './workflow-page-tabs.styles';
import type { WorkflowPageTabsParams } from './workflow-page-tabs.types';

export default function WorkflowPageTabs() {
  const router = useRouter();
  const params = useParams<WorkflowPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as WorkflowPageTabsParams;
  return (
    <PageTabs
      selectedTab={decodedParams.workflowTab}
      tabList={workflowPageTabsConfig}
      setSelectedTab={(newTab) => {
        router.push(encodeURIComponent(newTab.toString()));
      }}
      endEnhancer={
        <styled.EndButtonsContainer>
          <WorkflowPageCliCommandsButton />
          <ErrorBoundary fallbackRender={() => null} omitLogging={true}>
            <WorkflowPageActionsButton />
          </ErrorBoundary>
        </styled.EndButtonsContainer>
      }
    />
  );
}
