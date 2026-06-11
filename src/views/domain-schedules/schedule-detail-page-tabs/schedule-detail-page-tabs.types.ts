import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type scheduleDetailTabsConfig from '../schedule-detail-page/schedule-detail-tabs.config';

export type ScheduleDetailTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
};

export type ScheduleDetailPageTabsConfig<K extends string> = Record<
  K,
  ScheduleDetailTabConfig
>;

export type ScheduleDetailTabName = keyof typeof scheduleDetailTabsConfig;

export type ScheduleDetailPageTabsParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
  scheduleTab: ScheduleDetailTabName;
};
