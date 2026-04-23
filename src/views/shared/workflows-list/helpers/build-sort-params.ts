import { type SortOrder, toggleSortOrder } from '@/utils/sort-by';

import { type SortParams } from '../workflows-list.types';

export default function buildSortParams({
  sortColumn,
  sortOrder,
  setSortQueryParams,
}: {
  sortColumn: string;
  sortOrder: SortOrder;
  setSortQueryParams: (params: {
    sortColumn: string;
    sortOrder: SortOrder;
  }) => void;
}): SortParams {
  return {
    onSort: (column: string) =>
      setSortQueryParams({
        sortColumn: column,
        sortOrder: toggleSortOrder({
          currentSortColumn: sortColumn,
          currentSortOrder: sortOrder,
          newSortColumn: column,
          defaultSortOrder: 'DESC',
        }),
      }),
    sortColumn,
    sortOrder,
  };
}
