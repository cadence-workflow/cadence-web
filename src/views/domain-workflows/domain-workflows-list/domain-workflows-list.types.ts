import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

export type Props = {
  domain: string;
  cluster: string;
  visibleColumns: Array<WorkflowsListColumn>;
  timeRangeStart?: string;
  timeRangeEnd: string;
};
