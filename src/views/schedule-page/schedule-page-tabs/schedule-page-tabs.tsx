'use client';
import React, { useMemo } from 'react';

import { useParams, useRouter } from 'next/navigation';

import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';

import schedulePageTabsConfig from '../config/schedule-page-tabs.config';

import { type SchedulePageTabsParams } from './schedule-page-tabs.types';

export default function SchedulePageTabs() {
  const router = useRouter();
  const params = useParams<SchedulePageTabsParams>();
  const decodedParams = decodeUrlParams(params) as SchedulePageTabsParams;

  const tabList = useMemo(
    () =>
      Object.entries(schedulePageTabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
      })),
    []
  );

  return (
    <PageTabs
      selectedTab={decodedParams.scheduleTab}
      tabList={tabList}
      setSelectedTab={(newTab) => {
        router.push(encodeURIComponent(newTab.toString()));
      }}
    />
  );
}
