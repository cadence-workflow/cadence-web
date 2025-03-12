import mergeSortedArrays from '../merge-sorted-arrays';

function defaultCompareFunc(a: number, b: number) {
  return a < b ? -1 : 1;
}

describe(mergeSortedArrays.name, () => {
  it('should merge and pick top items from sorted arrays', () => {
    const sortedArrays = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];
    const itemsCount = 5;
    const result = mergeSortedArrays({
      sortedArrays,
      itemsCount,
      compareFunc: defaultCompareFunc,
    });
    expect(result.sortedArray).toEqual([1, 2, 3, 4, 5]);
    expect(result.pointers).toEqual([1, 1, 0]);
  });

  it('should handle empty arrays', () => {
    const sortedArrays: number[][] = [[], [], []];
    const itemsCount = 3;
    const result = mergeSortedArrays({
      sortedArrays,
      itemsCount,
      compareFunc: defaultCompareFunc,
    });
    expect(result.sortedArray).toEqual([]);
    expect(result.pointers).toEqual([-1, -1, -1]);
  });

  it('should handle arrays with different lengths', () => {
    const sortedArrays = [[1, 3], [2, 4, 6], [5]];
    const itemsCount = 4;
    const result = mergeSortedArrays({
      sortedArrays,
      itemsCount,
      compareFunc: defaultCompareFunc,
    });
    expect(result.sortedArray).toEqual([1, 2, 3, 4]);
    expect(result.pointers).toEqual([1, 1, -1]);
  });

  it('should use custom compare function', () => {
    const sortedArrays = [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ];
    const itemsCount = 5;
    const compareFunc = (a: number, b: number) => (a < b ? 1 : -1);
    const result = mergeSortedArrays({ sortedArrays, itemsCount, compareFunc });
    expect(result.sortedArray).toEqual([9, 8, 7, 6, 5]);
    expect(result.pointers).toEqual([0, 1, 1]);
  });

  it('should handle itemsCount greater than total elements', () => {
    const sortedArrays = [
      [1, 3],
      [2, 4],
    ];
    const itemsCount = 10;
    const result = mergeSortedArrays({
      sortedArrays,
      itemsCount,
      compareFunc: defaultCompareFunc,
    });
    expect(result.sortedArray).toEqual([1, 2, 3, 4]);
    expect(result.pointers).toEqual([1, 1]);
  });
});
