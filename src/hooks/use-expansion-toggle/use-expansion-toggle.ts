import { useCallback, useState } from 'react';

import { omit } from 'lodash';

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
        let newState: Record<string, boolean>;
        if (prev === true) {
          const retainedExpansion = items.reduce(
            (result, item) => {
              result[item] = true;
              return result;
            },
            {} as Record<string, boolean>
          );
          newState = omit(retainedExpansion, item);
        } else {
          if (prev[item] === true) {
            newState = omit(prev, item);
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
