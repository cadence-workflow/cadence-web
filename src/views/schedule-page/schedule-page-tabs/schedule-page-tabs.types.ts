import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type schedulePageTabsConfig from '../config/schedule-page-tabs.config';

export type SchedulePageTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
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
