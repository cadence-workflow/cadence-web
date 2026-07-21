import { type ReactNode } from 'react';

export type Props = {
  cluster: string;
  domain: string;
  searchAttributes?: Record<string, unknown> | null;
};

export type WorkflowSummaryScheduleDetailsRowArgs = Props & {
  scheduleId: string;
};

export type WorkflowSummaryScheduleDetailsConfig = {
  key: string;
  getLabel: () => string;
  getValue: (args: WorkflowSummaryScheduleDetailsRowArgs) => ReactNode;
  hide?: (args: WorkflowSummaryScheduleDetailsRowArgs) => boolean;
};
