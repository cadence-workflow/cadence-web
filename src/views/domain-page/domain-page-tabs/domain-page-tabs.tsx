'use client';
import React, { useMemo } from 'react';

import omit from 'lodash/omit';
import { useRouter, useParams } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';
import useConfigGatedTabs from '@/views/shared/hooks/use-config-gated-tabs';

import domainPageTabsConfig from '../config/domain-page-tabs.config';
import DomainPageActionsDropdown from '../domain-page-actions-dropdown/domain-page-actions-dropdown';
import DomainPageHelp from '../domain-page-help/domain-page-help';

import { styled } from './domain-page-tabs.styles';
import { type DomainPageTabsParams } from './domain-page-tabs.types';

export default function DomainPageTabs() {
  const router = useRouter();
  const params = useParams<DomainPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as DomainPageTabsParams;

  const configArgs = {
    domain: decodedParams.domain,
    cluster: decodedParams.cluster,
  };

  const { tabsToHide } = useConfigGatedTabs([
    {
      tab: 'failovers',
      title: domainPageTabsConfig.failovers.title,
      key: 'FAILOVER_HISTORY_ENABLED',
    },
    {
      tab: 'cron-list',
      title: domainPageTabsConfig['cron-list'].title,
      key: 'CRON_LIST_ENABLED',
      args: configArgs,
    },
    {
      tab: 'batch-actions',
      title: domainPageTabsConfig['batch-actions'].title,
      key: 'BATCH_ACTIONS_UI_ENABLED',
      args: configArgs,
    },
    {
      tab: 'schedules',
      title: domainPageTabsConfig.schedules.title,
      key: 'SCHEDULES_ENABLED',
      args: configArgs,
    },
  ]);

  const tabsToHideKey = tabsToHide.join(',');

  const tabsConfig = useMemo<Partial<typeof domainPageTabsConfig>>(
    () => omit(domainPageTabsConfig, tabsToHide),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabsToHideKey]
  );

  const tabList = useMemo(
    () =>
      Object.entries(tabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
        endEnhancer: tabConfig.endEnhancer,
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
            <DomainPageActionsDropdown {...decodedParams} />
            <DomainPageHelp />
          </styled.EndButtonsContainer>
        }
      />
    </styled.PageTabsContainer>
  );
}
