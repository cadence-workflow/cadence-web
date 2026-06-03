import { type Dispatch, type SetStateAction } from 'react';

// A single piece of state mirroring use-expansion-toggle's ExpansionState:
// either `true` (every item is selected) or an explicit map of selected ids.
// The two representations never coexist.
export type ListSelectionState<T extends string> = Record<T, boolean> | true;

export type UseListSelectionParams = {
  // Total number of items in the underlying set (e.g. the matching result set,
  // which may be larger than what is currently rendered). Used to report the
  // count while "select all" is active, so the full id list is never required.
  totalCount: number;
};

export type UseListSelectionResult<T extends string> = {
  selectedItems: ListSelectionState<T>;
  setSelectedItems: Dispatch<SetStateAction<ListSelectionState<T>>>;

  // True when every item in the set is selected. While active, individual items
  // cannot be toggled off.
  isAllSelected: boolean;
  // Ids individually selected. Empty while isAllSelected is true (the whole set
  // is implied and is not enumerable from a count alone).
  selectedIds: ReadonlySet<T>;
  // isAllSelected ? totalCount : number of individually-selected ids
  selectedCount: number;

  isSelected: (id: T) => boolean;
  toggleId: (id: T) => void;
  toggleAll: () => void;
  reset: () => void;
};
