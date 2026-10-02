import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';
import { type SortOrder } from '@/utils/sort-by';

export type Props = {
  domain: string;
  cluster: string;
  workflows: Array<WorkflowListItem>;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  sortOrder: SortOrder;
  onSort: (column: string) => void;
};

export type ScheduleRunsTableRow = WorkflowListItem &
  Pick<Props, 'domain' | 'cluster'>;
