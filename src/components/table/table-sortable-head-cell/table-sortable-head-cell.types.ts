import { type SortOrder } from '@/utils/sort-by';

export type Props = {
  name: string;
  columnID: string;
  width: string;
  sortColumn?: string;
  sortOrder?: SortOrder;
  onSort: (column: string) => void;
};
