import { MdCalendarMonth, MdTimeline } from 'react-icons/md';

import { type ScheduleDetailPageTabsConfig } from '../schedule-detail-page-tabs/schedule-detail-page-tabs.types';

const scheduleDetailTabsConfig: ScheduleDetailPageTabsConfig<
  'details' | 'runs'
> = {
  details: {
    title: 'Details',
    artwork: MdCalendarMonth,
  },
  runs: {
    title: 'Runs',
    artwork: MdTimeline,
  },
};

export default scheduleDetailTabsConfig;
