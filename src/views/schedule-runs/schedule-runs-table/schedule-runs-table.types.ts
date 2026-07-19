import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';

export type Props = {
  domain: string;
  cluster: string;
  workflows: Array<WorkflowListItem>;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

export type ScheduleRunsTableRow = WorkflowListItem &
  Pick<Props, 'domain' | 'cluster'>;
