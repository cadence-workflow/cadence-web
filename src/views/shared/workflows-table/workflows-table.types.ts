import { type TableColumn } from '@/components/table/table.types';
import { type SortOrder } from '@/utils/sort-by';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

type SortParams = {
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: SortOrder;
};

export type Props = {
  workflows: Array<DomainWorkflow>;
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  sortParams?: SortParams;
};

export type WorkflowsTableNonSortableConfig = Array<
  Omit<TableColumn<DomainWorkflow>, 'sortable'>
>;
