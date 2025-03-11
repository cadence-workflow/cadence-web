/**
 * Merges items from multiple sorted arrays and picks the top items in order.
 *
 * This function combines multiple sorted arrays, selects a specified number of items (`itemsCount`),
 * and returns them in sorted order. It is useful for scenarios like retrieving the largest or smallest
 * `X` items from several pre-sorted arrays.
 *
 * @param sortedArrays - An array of sorted arrays to pick items from and merge.
 * @param itemsCount - The number of items to pick from the sorted arrays.
 * @param shouldPickSecond - A comparison function that returns true if the second argument
 *   should be picked over the first argument.
 * - **Note:** The comparison logic must align with the sorting logic of the input arrays to maintain consistency.
 *
 * @returns An object containing:
 *   - `pointers`: An array of the last picked index from each input array.
 *   - `sortedArray`: The final sorted array containing the picked items.
 */
export default function mergeSortedArrays<T>({
  sortedArrays,
  itemsCount,
  shouldPickSecond = (first: T, second: T): boolean => first < second,
}: {
  sortedArrays: Array<Array<T>>;
  itemsCount: number;
  shouldPickSecond: (first: T, second: T) => boolean;
}) {
  const pointers: Array<number> = new Array(sortedArrays.length).fill(-1);
  const sortedArray: Array<T> = [];

  for (let i = 0; i < itemsCount; i++) {
    const pickedItemInfo = pointers.reduce(
      (result: { value: T; index: number } | undefined, p, arrIndex) => {
        if (p >= sortedArrays[arrIndex].length - 1) return result;

        const valueAtNextPointer = sortedArrays[arrIndex][p + 1];
        if (!result || shouldPickSecond(result.value, valueAtNextPointer))
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
