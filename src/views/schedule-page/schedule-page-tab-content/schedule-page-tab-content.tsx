'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import decodeUrlParams from '@/utils/decode-url-params';

import schedulePageTabsConfig from '../config/schedule-page-tabs.config';
import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';

import { cssStyles } from './schedule-page-tab-content.styles';
import { type Props } from './schedule-page-tab-content.types';

export default function SchedulePageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams = decodeUrlParams(params) as SchedulePageTabsParams;
  const tabConfig = schedulePageTabsConfig[decodedParams.scheduleTab];

  if (!tabConfig) {
    return notFound();
  }

  return (
    <div className={cls.tabContentContainer}>
      <div>{tabConfig.title} — coming soon</div>
    </div>
  );
}
