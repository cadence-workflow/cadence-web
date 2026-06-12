import type React from 'react';

export type ScheduleDetailsPageLayoutParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type Props = {
  params: ScheduleDetailsPageLayoutParams;
  children: React.ReactNode;
};
