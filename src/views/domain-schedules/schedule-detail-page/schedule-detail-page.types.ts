import type React from 'react';

export type ScheduleDetailPageLayoutParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type Props = {
  params: ScheduleDetailPageLayoutParams;
  children: React.ReactNode;
};
