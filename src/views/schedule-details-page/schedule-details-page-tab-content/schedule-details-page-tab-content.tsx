'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import decodeUrlParams from '@/utils/decode-url-params';

import scheduleDetailsTabsConfig from '../config/schedule-details-tabs.config';
import { type ScheduleDetailsPageTabsParams } from '../schedule-details-page-tabs/schedule-details-page-tabs.types';

import { cssStyles } from './schedule-details-page-tab-content.styles';
import { type Props } from './schedule-details-page-tab-content.types';

export default function ScheduleDetailsPageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams = decodeUrlParams(
    params
  ) as ScheduleDetailsPageTabsParams;
  const tabConfig = scheduleDetailsTabsConfig[decodedParams.scheduleTab];

  if (!tabConfig) {
    return notFound();
  }

  return (
    <div className={cls.tabContentContainer}>
      <div>{tabConfig.title} — coming soon</div>
    </div>
  );
}
