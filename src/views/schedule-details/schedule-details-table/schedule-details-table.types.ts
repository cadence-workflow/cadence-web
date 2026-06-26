import type React from 'react';

export type ScheduleDetailsTableRow = {
  key?: React.Key;
  label: React.ReactNode;
  value?: React.ReactNode;
  hide?: boolean;
};

export type Props = {
  rows: ScheduleDetailsTableRow[];
  emptyValue?: React.ReactNode;
  ariaLabel?: string;
};
