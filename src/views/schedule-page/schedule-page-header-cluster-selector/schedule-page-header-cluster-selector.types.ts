import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';
import { type SchedulePageLayoutParams } from '../schedule-page.types';

export type Props = {
  domain: string;
  cluster: string;
};

export type BuildSchedulePageClusterPathParams = Pick<
  SchedulePageTabsParams,
  'domain' | 'scheduleId' | 'scheduleTab'
> &
  Pick<SchedulePageLayoutParams, 'cluster'>;
