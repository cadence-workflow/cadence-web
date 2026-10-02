import { type ReactNode } from 'react';

import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type SkippedRunPopoverEntry = {
  kind: 'skipped';
  scheduledTimeMs: number;
};

export type NextRunPopoverEntry = {
  kind: 'next';
  scheduledTimeMs: number;
};

export type RunPopoverEntry = {
  kind: 'run';
  run: ChartSeriesRun;
};

export type ChartRunPopoverEntry =
  | RunPopoverEntry
  | SkippedRunPopoverEntry
  | NextRunPopoverEntry;

export type PopoverEntryRow = {
  label: string;
  value: ReactNode;
};

export type PopoverEntryProps = {
  title: ReactNode;
  rows: PopoverEntryRow[];
};

export type Props = {
  entries: ChartRunPopoverEntry[];
  domain: string;
  cluster: string;
};
