import {
  type InfiniteQueryObserverResult,
  type InfiniteData,
} from '@tanstack/react-query';

export default function getMergedFetchNextPage<T, R>({
  queryResults,
  flattenedDataArrays,
  pointers,
  pageSize,
  setCount,
}: {
  queryResults: Array<InfiniteQueryObserverResult<InfiniteData<R>>>;
  flattenedDataArrays: Array<Array<T>>;
  pointers: Array<number>;
  pageSize: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  return () => {
    const nextPagePromises = queryResults.map(
      ({ hasNextPage, fetchNextPage }, index) => {
        if (
          hasNextPage &&
          flattenedDataArrays[index].length - 1 - pointers[index] < pageSize
        ) {
          return fetchNextPage();
        }
        return Promise.resolve();
      }
    );
    return Promise.all(nextPagePromises)
      .then((d) => {
        if (d.every((queryResult) => !queryResult?.isError)) {
          setCount((v) => v + pageSize);
        }
      })
      .catch(() => Promise.reject);
  };
}
