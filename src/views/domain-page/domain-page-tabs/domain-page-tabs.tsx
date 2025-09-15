'use client';
import React, { useMemo } from 'react';

import { useRouter, useParams } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';

import domainPageTabsConfig from '../config/domain-page-tabs.config';
import DomainPageHelp from '../domain-page-help/domain-page-help';
import DomainPageStartWorkflowButton from '../domain-page-start-workflow-button/domain-page-start-workflow-button';

import { styled } from './domain-page-tabs.styles';
import type { DomainPageTabsParams } from './domain-page-tabs.types';

export default function DomainPageTabs() {
  const router = useRouter();
  const params = useParams<DomainPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as DomainPageTabsParams;

  const tabList = useMemo(
    () =>
      Object.entries(domainPageTabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
      })),
    []
  );

  return (
    <styled.PageTabsContainer>
      <PageTabs
        selectedTab={decodedParams.domainTab}
        tabList={tabList}
        setSelectedTab={(newTab) => {
          router.push(
            `${encodeURIComponent(newTab.toString())}${window.location.search}`
          );
        }}
        endEnhancer={
          <styled.EndButtonsContainer>
            <DomainPageStartWorkflowButton {...decodedParams} />
            <DomainPageHelp />
          </styled.EndButtonsContainer>
        }
      />
    </styled.PageTabsContainer>
  );
}
