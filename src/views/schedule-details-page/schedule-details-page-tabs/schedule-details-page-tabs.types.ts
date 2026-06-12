import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type scheduleDetailsTabsConfig from '../config/schedule-details-tabs.config';

export type ScheduleDetailTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
};

export type ScheduleDetailsPageTabsConfig<K extends string> = Record<
  K,
  ScheduleDetailTabConfig
>;

export type ScheduleDetailTabName = keyof typeof scheduleDetailsTabsConfig;

export type ScheduleDetailsPageTabsParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
  scheduleTab: ScheduleDetailTabName;
};
