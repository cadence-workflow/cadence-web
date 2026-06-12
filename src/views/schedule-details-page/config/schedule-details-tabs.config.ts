import { MdCalendarMonth, MdTimeline } from 'react-icons/md';

import { type ScheduleDetailsPageTabsConfig } from '../schedule-details-page-tabs/schedule-details-page-tabs.types';

const scheduleDetailsTabsConfig: ScheduleDetailsPageTabsConfig<
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

export default scheduleDetailsTabsConfig;
