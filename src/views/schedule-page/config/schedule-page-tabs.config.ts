import { MdCalendarMonth, MdTimeline } from 'react-icons/md';

import { type SchedulePageTabsConfig } from '../schedule-page-tabs/schedule-page-tabs.types';

const schedulePageTabsConfig: SchedulePageTabsConfig<'details' | 'runs'> = {
  details: {
    title: 'Details',
    artwork: MdCalendarMonth,
  },
  runs: {
    title: 'Runs',
    artwork: MdTimeline,
  },
};

export default schedulePageTabsConfig;
