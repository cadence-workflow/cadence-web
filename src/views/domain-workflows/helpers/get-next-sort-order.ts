import { type SortOrder } from '@/utils/sort-by';

export default function getNextSortOrder({
  currentColumn,
  nextColumn,
  currentSortOrder,
}: {
  currentColumn: string;
  nextColumn: string;
  currentSortOrder: SortOrder;
}): SortOrder {
  if (currentColumn === nextColumn) {
    return currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
  }
  return 'DESC';
}
