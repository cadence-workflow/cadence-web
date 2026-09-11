import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  InfiniteQueryObserver,
  type DefaultedInfiniteQueryObserverOptions,
  type InfiniteData,
  type QueryKey,
  useQueryClient,
} from '@tanstack/react-query';

import mergeSortedArrays from '@/utils/merge-sorted-arrays';

import getMergedFetchNextPage from './helpers/get-merged-fetch-next-page';
import getMergedQueryStatus from './helpers/get-merged-query-status';
import { UseMergedInfiniteQueriesError } from './use-merged-infinite-queries-error';
import {
  type SingleInfiniteQueryResult,
  type MergedQueriesResults,
  type Props,
} from './use-merged-infinite-queries.types';

/**
 * Combines results from multiple infinite queries in sorted order.
 *
 * To ensure the order of the combined results remains consistent even after fetching additional data,
 * this hook requests extra data (page size * number of queries) from all queries. This ensures
 * no higher-priority items are missed when sorting, even if they appear in later pages of data.
 *
 * For instance, to show 5 items across 3 queries, it fetches 15 items.
 *
 * @param queries - Array of react-query Infinite Query configurations.
 * @param pageSize - Number of items to add to the result array when requesting new data.
 * @param flattenResponse - A function that takes the expected query response and flattens it into an array of items
 * @param compare - A comparison function used to determine the order of items. It should take two items and return:
 *   - A positive number (> 0) if the second item should come before the first.
 *   - Zero or a negative number (<= 0) if the first item should come before the second.
 *   - This logic must match the sorting logic used in the queries to ensure consistency.
 *   - For more details, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn
 *
 * @returns A tuple [mergedQueryResults, queryResults]:
 *   - `mergedQueryResults`: The merged and sorted results from all queries. Its `hasNextPage`
 *     covers both already fetched items that are not displayed yet and pages that are still
 *     unfetched, so it stays true for as long as `fetchNextPage` can add items to `data`.
 *   - `queryResults`: An array containing individual results from each query.
 */
export default function useMergedInfiniteQueries<
  TData,
  TResponse,
  TPageParam,
  TQueryKey extends QueryKey,
>({
  queries,
  pageSize,
  flattenResponse,
  compare,
}: Props<TData, TResponse, TPageParam, TQueryKey>): [
  MergedQueriesResults<TData>,
  Array<SingleInfiniteQueryResult<TResponse>>,
] {
  const [count, setCount] = useState(pageSize);
  const queryClient = useQueryClient();

  // Created synchronously (and memoised) rather than inside the effect below, so that
  // the lazy useState initialiser for queryResults can use them to compute each query's
  // optimistic result before the first commit, the same way TanStack's useBaseQuery does.
  const observers = useMemo(
    () => (queries || []).map((q) => new InfiniteQueryObserver(queryClient, q)),
    [queries, queryClient]
  );

  const [queryResults, setQueryResults] = useState<
    Array<SingleInfiniteQueryResult<TResponse>>
  >(() =>
    observers.map((observer, index) => {
      // queryClient.defaultQueryOptions() always returns the base
      // DefaultedQueryObserverOptions type (it does not vary its return type based on
      // whether the input included infinite-query-only fields like getNextPageParam),
      // even though the defaulted object it returns does carry those fields through from
      // `queries[index]`. This mirrors what TanStack's own useBaseQuery does internally.
      const defaultedOptions = {
        ...queryClient.defaultQueryOptions(queries[index]),
        _optimisticResults: 'optimistic',
      } as DefaultedInfiniteQueryObserverOptions<
        TResponse,
        Error,
        InfiniteData<TResponse, TPageParam>,
        TResponse,
        TQueryKey,
        TPageParam
      >;
      return observer.getOptimisticResult(defaultedOptions);
    })
  );

  useEffect(() => {
    setCount(pageSize);

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
  }, [observers, pageSize]);

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

  // The queries fetch further ahead than what is displayed, and their pages stay in
  // the react-query cache when the queries change, so items can be waiting to be
  // displayed while no query has another page left to fetch.
  const hasUndisplayedItems = useMemo(
    () =>
      sortedArray.length <
      flattenedDataArrays.reduce((total, items) => total + items.length, 0),
    [sortedArray, flattenedDataArrays]
  );

  const refetchQueriesWithError = useCallback(() => {
    queryResults.forEach((res) => {
      if (res.isError) {
        res.refetch();
      }
    });
  }, [queryResults]);

  const mergedQueryResults = {
    data: sortedArray,
    status: getMergedQueryStatus(queryResults),
    isLoading: queryResults.some((qr) => qr.isLoading),
    isFetching: queryResults.some((qr) => qr.isFetching),
    isFetchingNextPage: queryResults.some((qr) => qr.isFetchingNextPage),
    hasNextPage:
      hasUndisplayedItems || queryResults.some((qr) => qr.hasNextPage),
    fetchNextPage: getMergedFetchNextPage({
      queryResults,
      flattenedDataArrays,
      pointers,
      pageSize,
      setCount,
    }),
    error: queryResults.some((qr) => qr.isError)
      ? new UseMergedInfiniteQueriesError(
          'One or more infinite queries failed',
          queryResults.reduce((errors: Array<Error>, qr) => {
            if (qr.isError) {
              errors.push(qr.error);
            }
            return errors;
          }, [])
        )
      : null,
    refetch: refetchQueriesWithError,
    // ...add other properties if needed
  };
  return [mergedQueryResults, queryResults];
}
