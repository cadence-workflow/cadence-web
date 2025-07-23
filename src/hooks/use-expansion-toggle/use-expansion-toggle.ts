import { useCallback, useState } from 'react';

import {
  type UseExpansionToggleReturn,
  type Props,
  type ExpansionState,
} from './use-expansion-toggle.types';

export default function useExpansionToggle<T extends string>({
  items,
  initialState,
}: Props<T>): UseExpansionToggleReturn<T> {
  const [expandedItems, setExpandedItems] =
    useState<ExpansionState<T>>(initialState);

  const areAllItemsExpanded = expandedItems === true;

  const toggleAreAllItemsExpanded = useCallback(() => {
    setExpandedItems((prev) =>
      prev === true ? ({} as ExpansionState<T>) : true
    );
  }, []);

  const getIsItemExpanded = useCallback(
    (item: T) => {
      if (expandedItems === true) {
        return true;
      }

      return Boolean(expandedItems[item]);
    },
    [expandedItems]
  );

  const toggleIsItemExpanded = useCallback(
    (item: T) => {
      setExpandedItems((prev) => {
        let newState: Record<T, boolean>;
        if (prev === true) {
          newState = items.reduce(
            (result, i) => {
              if (i !== item) {
                result[i] = true;
              }
              return result;
            },
            {} as Record<T, boolean>
          );
        } else {
          if (prev[item] === true) {
            newState = prev;
            delete newState[item];
          } else {
            newState = {
              ...prev,
              [item]: true,
            };
          }
        }
        if (items.every((item) => newState[item])) {
          return true;
        }
        return newState;
      });
    },
    [items]
  );

  return {
    expandedItems,
    setExpandedItems,

    areAllItemsExpanded,
    toggleAreAllItemsExpanded,

    getIsItemExpanded,
    toggleIsItemExpanded,
  };
}
