'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import schedulePageTabsConfig from '../config/schedule-page-tabs.config';

import { cssStyles } from './schedule-page-tab-content.styles';
import { type Props } from './schedule-page-tab-content.types';

export default function SchedulePageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const tabConfig = schedulePageTabsConfig[params.scheduleTab];
  const TabContent = tabConfig?.content;

  if (!tabConfig) {
    return notFound();
  }

  return (
    <div className={cls.tabContentContainer}>
      <TabContent params={params} />
    </div>
  );
}
