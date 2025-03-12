/**
 * Merges items from multiple sorted arrays and picks the top items in order.
 *
 * This function combines multiple sorted arrays, selects a specified number of items (`itemsCount`),
 * and returns them in sorted order. It is useful for scenarios like retrieving the largest or smallest
 * `X` items from several pre-sorted arrays.
 *
 * @param sortedArrays - An array of sorted arrays to pick items from and merge.
 * @param itemsCount - The number of items to pick from the sorted arrays.
 * @param compareFunc - A comparison function used to determine the order of items. It should take two items and return:
 *   - A positive number (> 0) if the second item should come before the first.
 *   - Zero or a negative number (<= 0) if the first item should come before the second.
 *   - This logic must match the sorting logic of the input arrays to ensure consistency.
 *   - For more details, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn
 *
 * @returns An object containing:
 *   - `pointers`: An array of the last picked index from each input array.
 *   - `sortedArray`: The final sorted array containing the picked items.
 */
export default function mergeSortedArrays<T>({
  sortedArrays,
  itemsCount,
  compareFunc = (a: T, b: T): number => (a < b ? -1 : 1),
}: {
  sortedArrays: Array<Array<T>>;
  itemsCount: number;
  compareFunc: (a: T, b: T) => number;
}) {
  const pointers: Array<number> = new Array(sortedArrays.length).fill(-1);
  const sortedArray: Array<T> = [];

  for (let i = 0; i < itemsCount; i++) {
    const pickedItemInfo = pointers.reduce(
      (result: { value: T; index: number } | undefined, p, arrIndex) => {
        if (p >= sortedArrays[arrIndex].length - 1) return result;

        const valueAtNextPointer = sortedArrays[arrIndex][p + 1];
        if (!result || compareFunc(result.value, valueAtNextPointer) > 0)
          return { value: valueAtNextPointer, index: arrIndex };

        return result;
      },
      undefined
    );

    if (pickedItemInfo) {
      const { value: pickedVal, index: pickedFromArrayIndex } = pickedItemInfo;
      sortedArray.push(pickedVal);
      pointers[pickedFromArrayIndex] = pointers[pickedFromArrayIndex] + 1;
    }
  }

  return { pointers, sortedArray };
}
