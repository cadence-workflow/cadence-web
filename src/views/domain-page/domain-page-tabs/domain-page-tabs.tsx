'use client';
import React, { useMemo } from 'react';

import omit from 'lodash/omit';
import { useRouter, useParams } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import decodeUrlParams from '@/utils/decode-url-params';

import domainPageTabsConfig from '../config/domain-page-tabs.config';
import DomainPageHelp from '../domain-page-help/domain-page-help';
import DomainPageStartWorkflowButton from '../domain-page-start-workflow-button/domain-page-start-workflow-button';

import { styled } from './domain-page-tabs.styles';
import {
  type DomainPageTabName,
  type DomainPageTabsParams,
} from './domain-page-tabs.types';

export default function DomainPageTabs() {
  const router = useRouter();
  const params = useParams<DomainPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as DomainPageTabsParams;

  const { data: isFailoverHistoryEnabled } = useSuspenseConfigValue(
    'FAILOVER_HISTORY_ENABLED'
  );

  const { data: isCronListEnabled } = useSuspenseConfigValue(
    'CRON_LIST_ENABLED',
    {
      domain: decodedParams.domain,
      cluster: decodedParams.cluster,
    }
  );

  const tabsConfig = useMemo<Partial<typeof domainPageTabsConfig>>(() => {
    const tabsToHide: Array<DomainPageTabName> = [];

    if (!isFailoverHistoryEnabled) {
      tabsToHide.push('failovers');
    }

    if (!isCronListEnabled) {
      tabsToHide.push('cron-list');
    }

    return omit(domainPageTabsConfig, tabsToHide);
  }, [isFailoverHistoryEnabled, isCronListEnabled]);

  const tabList = useMemo(
    () =>
      Object.entries(tabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
      })),
    [tabsConfig]
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
