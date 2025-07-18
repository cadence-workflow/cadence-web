import { type Dispatch, type SetStateAction } from 'react';

export type ExpansionState<T extends string> = Record<T, boolean> | true;

export type Props<T extends string> = {
  initialState: ExpansionState<T>;
  items: Array<T>;
};

export type UseExpansionToggleReturn<T extends string> = {
  expandedItems: ExpansionState<T>;
  setExpandedItems: Dispatch<SetStateAction<ExpansionState<T>>>;

  areAllItemsExpanded: boolean;
  toggleAreAllItemsExpanded: () => void;

  getIsItemExpanded: (item: T) => boolean;
  toggleIsItemExpanded: (item: T) => void;
};
