import type React from 'react';

import { type ScheduleDetailTabName } from './schedule-detail-tabs.config';

export type ScheduleDetailPageParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
  scheduleTab: ScheduleDetailTabName;
};

export type Props = {
  params: ScheduleDetailPageParams;
  children: React.ReactNode;
};
