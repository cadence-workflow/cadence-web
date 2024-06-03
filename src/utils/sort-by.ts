const intlStringCompare = new Intl.Collator('en', { sensitivity: 'base' })
  .compare;

function getSortCompareFunction<ArrayItemType>(
  sortBy: (arrItem: ArrayItemType) => SortByReturnValue,
  sortOrder: SortOrder
) {
  const factor = sortOrder === 'ASC' ? 1 : -1;
  return (a: ArrayItemType, b: ArrayItemType): number => {
    let result;
    const aVal = sortBy(a);
    const bVal = sortBy(b);
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      // intlStringCompare causes issues with numeric values and float numbers. use default sort otherwise
      result = intlStringCompare(aVal, bVal);
    } else {
      if (aVal === bVal) result = 0;
      else if (aVal === undefined || (aVal === null && bVal !== undefined))
        result = -1;
      // null and undefined should always be swapped to become at the beginning, but undefined should be before null
      else if (bVal === undefined || bVal === null) result = 1;
      // @ts-ignore: 'aVal' is possibly 'null'. aVal can't be null but TS can't infere that from the above conditions
      else result = aVal < bVal ? -1 : 1;
    }
    return result !== 0 ? factor * result : result;
  };
}

function toggleSortOrder({
  currentSortColumn,
  currentSortOrder,
  newSortColumn,
}: {
  currentSortColumn?: string;
  currentSortOrder?: SortOrder;
  newSortColumn: string;
}) {
  return currentSortColumn === newSortColumn && currentSortOrder === 'ASC'
    ? 'DESC'
    : 'ASC';
}

function sortBy<ArrayItemType>(
  results: Array<ArrayItemType>,
  sortBy: (arrItem: ArrayItemType) => SortByReturnValue, // gets the current array item and should return the value to sort with
  sortOrder: SortOrder
): Array<ArrayItemType> {
  return [...results].sort(
    getSortCompareFunction<ArrayItemType>(sortBy, sortOrder)
  );
}
export type SortByReturnValue = string | number | boolean | null | undefined;
export type SortOrder = 'ASC' | 'DESC';
export { getSortCompareFunction, toggleSortOrder };
export default sortBy;
