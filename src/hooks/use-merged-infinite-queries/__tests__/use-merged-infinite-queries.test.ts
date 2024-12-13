import { act } from 'react-dom/test-utils';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useMergedInfiniteQueries from '../use-merged-infinite-queries';
import { UseMergedInfiniteQueriesError } from '../use-merged-infinite-queries-error';
import { type SingleInfiniteQueryOptions } from '../use-merged-infinite-queries.types';

type MockAPIResponse = {
  entries: Array<number>;
  nextPage: number;
};

const MOCK_QUERY_CONFIG: Array<
  SingleInfiniteQueryOptions<MockAPIResponse, number>
> = [
  {
    queryKey: ['even-numbers'],
    queryFn: async ({ pageParam }) => ({
      entries: Array.from({ length: 5 }, (_, i) => pageParam + i * 2),
      nextPage: pageParam + 10,
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  },
  {
    queryKey: ['odd-numbers'],
    queryFn: async ({ pageParam }) => ({
      entries: Array.from({ length: 5 }, (_, i) => pageParam + i * 2),
      nextPage: pageParam + 10,
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  },
];

const MOCK_QUERY_CONFIG_WITH_ERROR: Array<
  SingleInfiniteQueryOptions<MockAPIResponse, number>
> = [
  {
    queryKey: ['even-numbers'],
    queryFn: async ({ pageParam }) => ({
      entries: Array.from({ length: 5 }, (_, i) => pageParam + i * 2),
      nextPage: pageParam + 10,
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  },
  {
    queryKey: ['odd-numbers'],
    queryFn: async () => {
      throw new Error(`That's odd, something went wrong`);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  },
];

describe(useMergedInfiniteQueries.name, () => {
  it('should merge infinite query results, and return correct loading states', async () => {
    const { result } = renderHook(() =>
      useMergedInfiniteQueries({
        queries: MOCK_QUERY_CONFIG,
        pageSize: 5,
        flattenResponse: (res) => res.entries,
        compare: (a, b) => (a < b ? -1 : 1),
      })
    );

    expect(result.current[0].isFetching).toStrictEqual(true);
    expect(result.current[0].isLoading).toStrictEqual(true);
    expect(result.current[0].isFetchingNextPage).toStrictEqual(false);

    await waitFor(() => {
      const [mergedResult] = result.current;
      expect(mergedResult.data).toStrictEqual([0, 1, 2, 3, 4]);
    });

    const [{ fetchNextPage }] = result.current;

    act(() => {
      fetchNextPage();
    });

    expect(result.current[0].isFetching).toStrictEqual(true);
    expect(result.current[0].isLoading).toStrictEqual(false);
    expect(result.current[0].isFetchingNextPage).toStrictEqual(true);

    await waitFor(() => {
      const [mergedResult] = result.current;
      expect(mergedResult.data).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  it('should return partial query results if one of the queries fails', async () => {
    const { result } = renderHook(() =>
      useMergedInfiniteQueries({
        queries: MOCK_QUERY_CONFIG_WITH_ERROR,
        pageSize: 5,
        flattenResponse: (res) => res.entries,
        compare: (a, b) => (a < b ? -1 : 1),
      })
    );

    await waitFor(() => {
      const [mergedResult] = result.current;
      expect(mergedResult.data).toStrictEqual([0, 2, 4, 6, 8]);
      expect(mergedResult.status).toStrictEqual('error');
      expect(mergedResult.error).toBeInstanceOf(UseMergedInfiniteQueriesError);
    });
  });

  it('should fetch more data when fetchNextPage is called', async () => {
    const { result } = renderHook(() =>
      useMergedInfiniteQueries({
        queries: MOCK_QUERY_CONFIG,
        pageSize: 5,
        flattenResponse: (res) => res.entries,
        compare: (a, b) => (a < b ? -1 : 1),
      })
    );

    await waitFor(() => {
      const [_, queryResults] = result.current;
      expect(queryResults[0].data?.pages[0].entries).toStrictEqual([
        0, 2, 4, 6, 8,
      ]);
      expect(queryResults[1].data?.pages[0].entries).toStrictEqual([
        1, 3, 5, 7, 9,
      ]);
    });

    const [{ fetchNextPage }] = result.current;

    act(() => {
      fetchNextPage();
    });

    await waitFor(() => {
      const [_, queryResults] = result.current;
      expect(queryResults[0].data?.pages[1].entries).toStrictEqual([
        10, 12, 14, 16, 18,
      ]);
      expect(queryResults[1].data?.pages[1].entries).toStrictEqual([
        11, 13, 15, 17, 19,
      ]);
    });
  });

  it('should skip fetching more data if enough data has already been fetched', async () => {
    const { result } = renderHook(() =>
      useMergedInfiniteQueries({
        queries: MOCK_QUERY_CONFIG,
        pageSize: 5,
        flattenResponse: (res) => res.entries,
        compare: (a, b) => (a < b ? -1 : 1),
      })
    );

    await waitFor(() => {
      const [mergedResult, queryResults] = result.current;
      expect(mergedResult.status).toBe('success');
      // 1 page fetched from each endpoint
      expect(queryResults[0].data?.pages.length).toStrictEqual(1);
      expect(queryResults[1].data?.pages.length).toStrictEqual(1);
    });

    const [{ fetchNextPage: fetchSecondPage }] = result.current;

    act(() => {
      fetchSecondPage();
    });

    await waitFor(() => {
      const [mergedResult, queryResults] = result.current;
      expect(mergedResult.status).toBe('success');
      // 2 pages fetched from each endpoint
      expect(queryResults[0].data?.pages.length).toStrictEqual(2);
      expect(queryResults[1].data?.pages.length).toStrictEqual(2);
    });

    const [{ fetchNextPage: fetchThirdPage }] = result.current;

    act(() => {
      fetchThirdPage();
    });

    await waitFor(() => {
      const [mergedResult, queryResults] = result.current;
      expect(mergedResult.status).toBe('success');
      // still just 2 pages fetched from each endpoint
      expect(queryResults[0].data?.pages.length).toStrictEqual(2);
      expect(queryResults[1].data?.pages.length).toStrictEqual(2);
    });
  });
});
