import { type ChartRunPopoverEntry } from '@/views/schedule-details/schedule-details-runs-chart-run-popover/schedule-details-runs-chart-run-popover.types';

export type Props = {
  x: number;
  y: number;
  entries: ChartRunPopoverEntry[];
  domain: string;
  cluster: string;
  ariaLabel: string;
  testId: string;
};
