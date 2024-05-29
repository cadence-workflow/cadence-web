'use client';
import React from 'react';
import PageTabs from '@/components/page-tabs/page-tabs';
import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import type { WorkflowPageTabsParams } from './workflow-page-tabs.types';
import decodeUrlParams from '@/utils/decode-url-params';
import { useRouter, useParams } from 'next/navigation';

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
    />
  );
}
