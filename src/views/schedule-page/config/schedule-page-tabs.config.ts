import { MdListAlt, MdSort } from 'react-icons/md';

import { type SchedulePageTabsConfig } from '../schedule-page-tabs/schedule-page-tabs.types';

const schedulePageTabsConfig: SchedulePageTabsConfig<'details' | 'runs'> = {
  details: {
    title: 'Details',
    artwork: MdListAlt,
  },
  runs: {
    title: 'Runs',
    artwork: MdSort,
  },
};

export default schedulePageTabsConfig;
