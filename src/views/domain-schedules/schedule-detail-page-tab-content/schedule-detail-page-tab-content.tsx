'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import decodeUrlParams from '@/utils/decode-url-params';

import scheduleDetailTabsConfig from '../schedule-detail-page/schedule-detail-tabs.config';
import { type ScheduleDetailPageTabsParams } from '../schedule-detail-page-tabs/schedule-detail-page-tabs.types';

import { cssStyles } from './schedule-detail-page-tab-content.styles';
import { type Props } from './schedule-detail-page-tab-content.types';

export default function ScheduleDetailPageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams = decodeUrlParams(params) as ScheduleDetailPageTabsParams;
  const tabConfig = scheduleDetailTabsConfig[decodedParams.scheduleTab];

  if (!tabConfig) {
    return notFound();
  }

  return (
    <div className={cls.tabContentContainer}>
      <div>{tabConfig.title} — coming soon</div>
    </div>
  );
}
