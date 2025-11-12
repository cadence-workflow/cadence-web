'use client';
import React, { useMemo } from 'react';

import { useRouter, useParams } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
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

  const { data: isCronListEnabled } =
    useSuspenseConfigValue('CRON_LIST_ENABLED');

  const tabList = useMemo(
    () =>
      Object.entries(domainPageTabsConfig)
        .filter(([key]) => {
          // Include cron-list tab only when the feature flag is enabled.
          if (key === 'cron-list') {
            return isCronListEnabled;
          }
          return true;
        })
        .map(([key, tabConfig]) => ({
          key,
          title: tabConfig.title,
          artwork: tabConfig.artwork,
        })),
    [isCronListEnabled]
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
