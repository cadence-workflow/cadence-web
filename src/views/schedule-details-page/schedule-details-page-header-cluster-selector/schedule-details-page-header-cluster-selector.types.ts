import { type ScheduleDetailsPageTabsParams } from '../schedule-details-page-tabs/schedule-details-page-tabs.types';
import { type ScheduleDetailsPageLayoutParams } from '../schedule-details-page.types';

export type Props = {
  domain: string;
  cluster: string;
};

export type BuildScheduleDetailsPageClusterPathParams = Pick<
  ScheduleDetailsPageTabsParams,
  'domain' | 'scheduleId' | 'scheduleTab'
> &
  Pick<ScheduleDetailsPageLayoutParams, 'cluster'> & {
    cluster: string;
  };
