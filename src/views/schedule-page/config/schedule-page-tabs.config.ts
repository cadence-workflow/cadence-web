import { MdCalendarMonth, MdTimeline } from 'react-icons/md';

import ScheduleDetails from '@/views/schedule-details/schedule-details';

import getSchedulePageTabErrorConfig from '../helpers/get-schedule-page-tab-error-config';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart/schedule-detail-metrics-chart';
import { type SchedulePageTabsConfig } from '../schedule-page-tabs/schedule-page-tabs.types';

const schedulePageTabsConfig: SchedulePageTabsConfig<'details' | 'runs'> = {
  details: {
    title: 'Details',
    artwork: MdCalendarMonth,
    content: ScheduleDetails,
    getErrorConfig: getSchedulePageTabErrorConfig,
  },
  runs: {
    title: 'Runs',
    artwork: MdTimeline,
    content: ScheduleDetailMetricsChart,
    getErrorConfig: (error, params) =>
      getSchedulePageTabErrorConfig(
        error,
        params,
        'Failed to load schedule runs',
        'schedule runs'
      ),
  },
};

export default schedulePageTabsConfig;
