import { useCallback, useMemo, useState } from 'react';

import {
  type ListSelectionState,
  type UseListSelectionParams,
  type UseListSelectionResult,
} from './use-list-selection.types';

/**
 * Generic selection state for a list of items identified by a string id.
 *
 * Mirrors use-expansion-toggle: a single state value that is either `true`
 * (every item selected) or an explicit map of selected ids — the two never
 * coexist. It differs from use-expansion-toggle in two ways that the "select
 * workflows for a batch action" use case requires:
 * - individual toggling is locked while "select all" is active (no de-select of
 *   a single row), and
 * - the selected count is derived from a caller-supplied totalCount, because
 *   the matching set may be larger than what is rendered, so the full id list
 *   is never available.
 *
 * The hook holds no knowledge of the items themselves — the caller maps each
 * item to a stable id and renders the selection state.
 */
export default function useListSelection<T extends string = string>({
  totalCount,
}: UseListSelectionParams): UseListSelectionResult<T> {
  const [selectedItems, setSelectedItems] = useState<ListSelectionState<T>>(
    () => ({}) as ListSelectionState<T>
  );

  const isAllSelected = selectedItems === true;

  const isSelected = useCallback(
    (id: T) => selectedItems === true || Boolean(selectedItems[id]),
    [selectedItems]
  );

  const toggleId = useCallback((id: T) => {
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
  }, []);

  const toggleAll = useCallback(() => {
    // Turning "select all" off drops any individual selection, so the two
    // representations never coexist.
    setSelectedItems((prev) =>
      prev === true ? ({} as ListSelectionState<T>) : true
    );
  }, []);

  const reset = useCallback(() => {
    setSelectedItems({} as ListSelectionState<T>);
  }, []);

  const selectedIds = useMemo<ReadonlySet<T>>(() => {
    if (selectedItems === true) {
      return new Set<T>();
    }
    return new Set<T>(
      (Object.keys(selectedItems) as Array<T>).filter((id) => selectedItems[id])
    );
  }, [selectedItems]);

  const selectedCount = isAllSelected ? totalCount : selectedIds.size;

  return useMemo(
    () => ({
      selectedItems,
      setSelectedItems,
      isAllSelected,
      selectedIds,
      selectedCount,
      isSelected,
      toggleId,
      toggleAll,
      reset,
    }),
    [
      selectedItems,
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
