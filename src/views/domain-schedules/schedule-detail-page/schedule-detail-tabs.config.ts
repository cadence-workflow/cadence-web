import {
  MdBackup,
  MdCalendarMonth,
  MdCode,
  MdTimeline,
} from 'react-icons/md';

import { type PageTab } from '@/components/page-tabs/page-tabs.types';

export const SCHEDULE_DETAIL_TAB_NAMES = [
  'overview',
  'backfills',
  'input',
  'runs',
] as const;

export type ScheduleDetailTabName = (typeof SCHEDULE_DETAIL_TAB_NAMES)[number];

export const DEFAULT_SCHEDULE_DETAIL_TAB: ScheduleDetailTabName = 'overview';

export type ScheduleDetailTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
};

const scheduleDetailTabsConfig: Record<
  ScheduleDetailTabName,
  ScheduleDetailTabConfig
> = {
  overview: {
    title: 'Overview',
    artwork: MdCalendarMonth,
  },
  backfills: {
    title: 'Backfills',
    artwork: MdBackup,
  },
  input: {
    title: 'Input',
    artwork: MdCode,
  },
  runs: {
    title: 'Runs',
    artwork: MdTimeline,
  },
} as const;

export default scheduleDetailTabsConfig;
