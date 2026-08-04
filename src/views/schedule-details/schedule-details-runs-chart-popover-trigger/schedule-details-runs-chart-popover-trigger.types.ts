import { type ReactNode } from 'react';

import { type ChartRunPopoverEntry } from '@/views/schedule-details/schedule-details-runs-chart-popover/schedule-details-runs-chart-popover.types';

export type Props = {
  x: number;
  y: number;
  entries: ChartRunPopoverEntry[];
  domain: string;
  cluster: string;
  ariaLabel: string;
  testId: string;
  children: ReactNode;
};
