'use client';
import React, { useMemo } from 'react';

import { Button } from 'baseui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MdChevronLeft } from 'react-icons/md';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import PageTabs from '@/components/page-tabs/page-tabs';
import decodeUrlParams from '@/utils/decode-url-params';
import ScheduleActions from '@/views/schedule-actions/schedule-actions';

import schedulePageTabsConfig from '../config/schedule-page-tabs.config';

import { styled } from './schedule-page-tabs.styles';
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

  const schedulesListHref = `/domains/${params.domain}/${params.cluster}/schedules`;

  return (
    <styled.Container>
      <styled.TabsRow>
        <styled.BackSlot>
          <Button
            $as={Link}
            href={schedulesListHref}
            kind="tertiary"
            size="compact"
            startEnhancer={() => <MdChevronLeft size={20} aria-hidden />}
          >
            Back to schedules
          </Button>
        </styled.BackSlot>
        <styled.BackTabsDivider aria-hidden />
        <styled.TabsSlot>
          <PageTabs
            selectedTab={decodedParams.scheduleTab}
            tabList={tabList}
            removeTabBarGridGutters={true}
            hideTabBarBorder={true}
            setSelectedTab={(newTab) => {
              router.push(encodeURIComponent(newTab.toString()));
            }}
            endEnhancer={
              <ErrorBoundary fallbackRender={() => null}>
                <ScheduleActions />
              </ErrorBoundary>
            }
          />
        </styled.TabsSlot>
      </styled.TabsRow>
    </styled.Container>
  );
}
