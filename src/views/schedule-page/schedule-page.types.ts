import type React from 'react';

export type SchedulePageParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type Props = {
  params: SchedulePageParams;
  children: React.ReactNode;
};
