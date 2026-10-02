import type { ComponentType, ReactNode } from 'react';

import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type schedulePageTabsConfig from '../config/schedule-page-tabs.config';
import { type GetSchedulePageTabErrorConfig } from '../schedule-page-tabs-error/schedule-page-tabs-error.types';

export type SchedulePageTabContentProps = {
  params: SchedulePageTabsParams;
};

export type SchedulePageTabContent =
  | ComponentType<SchedulePageTabContentProps>
  | ((props: SchedulePageTabContentProps) => ReactNode);

export type SchedulePageTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
  content: SchedulePageTabContent;
  getErrorConfig: GetSchedulePageTabErrorConfig;
};

export type SchedulePageTabsConfig<K extends string> = Record<
  K,
  SchedulePageTabConfig
>;

export type SchedulePageTabName = keyof typeof schedulePageTabsConfig;

export type SchedulePageTabsParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
  scheduleTab: SchedulePageTabName;
};
