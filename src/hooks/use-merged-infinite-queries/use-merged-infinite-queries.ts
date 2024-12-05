import { useMemo, useState, useEffect } from 'react';

import { InfiniteQueryObserver, useQueryClient } from '@tanstack/react-query';

import mergeSortedArrays from '@/utils/merge-sorted-arrays';

import getMergedFetchNextPage from './helpers/get-merged-fetch-next-page';
import getMergedQueryStatus from './helpers/get-merged-query-status';
import {
  type SingleInfiniteQueryResult,
  type MergedQueriesResults,
  type Props,
} from './use-merged-infinite-queries.types';

/**
 * Combines results from multiple infinite queries in sorted order.
 *
 * To ensure the order of the combined results remains consistent even after fetching additional data,
 * this hook requests extra data (page size * number of queries) from all queries. This ensures no higher-priority items are missed
 * when sorting, even if they appear in later pages of data.
 *
 * For instance, to show 5 items across 3 queries, it fetches 15 items.
 *
 * @param queries - Array of react-query Infinite Query configurations.
 * @param pageSize - Number of items to add to the result array when requesting new data.
 * @param flattenResult - A function that takes the expected query result and flattens it into an array of items
 * @param compare - A comparison function used to sort and merge results.
 * The function should accept two arguments and return:
 *   - A number > 0 if the first argument has a higher priority.
 *   - A number <= 0 if the second argument has a higher or equal priority.
 *   - **Note:** The comparison logic must match the sorting logic used in the queries to maintain consistency.
 *
 * @returns A tuple [mergedQueryResults, queryResults]:
 *   - `mergedQueryResults`: The merged and sorted results from all queries.
 *   - `queryResults`: An array containing individual results from each query.
 */
export default function useMergedInfiniteQueries<TData, TResponse, TPageParam>({
  queries,
  pageSize,
  flattenResponse,
  compare,
}: Props<TData, TResponse, TPageParam>): [
  MergedQueriesResults<TData>,
  Array<SingleInfiniteQueryResult<TResponse>>,
] {
  const [count, setCount] = useState(pageSize);

  const [queryResults, setQueryResults] = useState<
    Array<SingleInfiniteQueryResult<TResponse>>
  >([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCount(pageSize);
    const observers = (queries || []).map((q) => {
      return new InfiniteQueryObserver(queryClient, q);
    });

    setQueryResults(observers.map((ob) => ob.getCurrentResult()));

    const unsubscribes = observers.map((observer, index) =>
      observer.subscribe((result) => {
        setQueryResults((v) => {
          const newV = [...v];
          newV[index] = result;
          return newV;
        });
      })
    );
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [queries, queryClient, pageSize]);

  const flattenedDataArrays: Array<Array<TData>> = useMemo(() => {
    return queryResults.map((queryResult) => {
      if (!queryResult.data) return [];
      return queryResult.data.pages.flatMap((res) => flattenResponse(res));
    });
  }, [queryResults, flattenResponse]);

  const { pointers, sortedArray } = useMemo(() => {
    return mergeSortedArrays<TData>({
      sortedArrays: flattenedDataArrays,
      itemsCount: count,
      compareFunc: compare,
    });
  }, [flattenedDataArrays, count, compare]);

  const mergedQueryResults = {
    data: sortedArray,
    status: getMergedQueryStatus(queryResults),
    isLoading: queryResults.some((qr) => qr.isLoading),
    isFetching: queryResults.some((qr) => qr.isFetching),
    isFetchingNextPage: queryResults.some((qr) => qr.isFetchingNextPage),
    hasNextPage: queryResults.some((qr) => qr.hasNextPage),
    fetchNextPage: getMergedFetchNextPage({
      queryResults,
      flattenedDataArrays,
      pointers,
      pageSize,
      setCount,
    }),
    // ...add other properties if needed
  };
  return [mergedQueryResults, queryResults];
}
