'use client';
import React from 'react';
import PageTabs from '@/components/page-tabs/page-tabs';
import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import type { Props, WorkflowPageTabsParams } from './workflow-page-tabs.types';
import decodeUrlParams from '@/utils/decode-url-params';
import PageSection from '@/components/page-section/page-section';

export default function WorkflowPageTabs({ params, children }: Props) {
  const decodedParams = decodeUrlParams(params) as WorkflowPageTabsParams;
  return (
    <>
      <PageTabs
        selectedTab={decodedParams.workflowTab}
        tabList={workflowPageTabsConfig}
        setSelectedTab={() => {}}
      />
      <PageSection>{children}</PageSection>
    </>
  );
}
