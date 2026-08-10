export type UseBatchActionSelectionParams = {
  // Total number of items in the matching result set, which may be larger than
  // what is currently rendered. Used to report the count while "select all" is
  // active, so the full id list is never required.
  totalCount: number;
};

export type UseBatchActionSelectionResult<T extends string> = {
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
