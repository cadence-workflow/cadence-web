'use client';
import React from 'react';

import { useRouter, useParams } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import WorkflowPageCliCommandsButton from '../workflow-page-cli-commands-button/workflow-page-cli-commands-button';

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
      endEnhancer={<WorkflowPageCliCommandsButton />}
    />
  );
}
