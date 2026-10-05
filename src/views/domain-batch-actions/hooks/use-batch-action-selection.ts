import { useCallback, useMemo } from 'react';

import useExpansionToggle from '@/hooks/use-expansion-toggle/use-expansion-toggle';
import { type ExpansionState } from '@/hooks/use-expansion-toggle/use-expansion-toggle.types';

import {
  type UseBatchActionSelectionParams,
  type UseBatchActionSelectionResult,
} from './use-batch-action-selection.types';

export default function useBatchActionSelection<T extends string = string>({
  totalCount,
}: UseBatchActionSelectionParams): UseBatchActionSelectionResult<T> {
  const {
    expandedItems: selectedItems,
    setExpandedItems: setSelectedItems,
    areAllItemsExpanded: isAllSelected,
    toggleAreAllItemsExpanded: toggleAll,
    getIsItemExpanded: isSelected,
  } = useExpansionToggle<T>({
    // The item list is intentionally empty: it only drives useExpansionToggle's
    // per-item toggle (which we replace with `toggleId` below), none of the
    // pieces we reuse depend on it.
    items: [] as Array<T>,
    initialState: {} as ExpansionState<T>,
  });

  const toggleId = useCallback(
    (id: T) => {
      setSelectedItems((prev) => {
        // While "select all" is active, individual items are locked.
        if (prev === true) return prev;

        if (prev[id]) {
          const next = Object.assign({}, prev);
          delete next[id];
          return next;
        }
        return { ...prev, [id]: true };
      });
    },
    [setSelectedItems]
  );

  const reset = useCallback(() => {
    setSelectedItems({} as ExpansionState<T>);
  }, [setSelectedItems]);

  const selectedIds = useMemo<ReadonlySet<T>>(() => {
    if (selectedItems === true) {
      return new Set<T>();
    }
    return new Set<T>(Object.keys(selectedItems) as Array<T>);
  }, [selectedItems]);

  const selectedCount = isAllSelected ? totalCount : selectedIds.size;

  return useMemo(
    () => ({
      isAllSelected,
      selectedIds,
      selectedCount,
      isSelected,
      toggleId,
      toggleAll,
      reset,
    }),
    [
      isAllSelected,
      selectedIds,
      selectedCount,
      isSelected,
      toggleId,
      toggleAll,
      reset,
    ]
  );
}
