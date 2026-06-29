import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';

export type Props = Pick<
  SchedulePageTabsParams,
  'domain' | 'cluster' | 'scheduleId'
>;
