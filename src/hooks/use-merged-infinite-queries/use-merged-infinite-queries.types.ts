import {
  type QueryKey,
  type InfiniteData,
  type UseInfiniteQueryOptions,
  type useInfiniteQuery,
} from '@tanstack/react-query';

export type MergedQueryStatus = 'idle' | 'loading' | 'success' | 'error';

export type MergedQueriesResults<TData> = {
  data: Array<TData>;
  status: MergedQueryStatus;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export type SingleInfiniteQueryOptions<TResponse, TPageParam> =
  UseInfiniteQueryOptions<
    TResponse,
    Error,
    InfiniteData<TResponse, TPageParam>,
    TResponse,
    QueryKey,
    TPageParam
  >;

export type SingleInfiniteQueryResult<TResponse> = ReturnType<
  typeof useInfiniteQuery<TResponse>
>;

export type Props<TData, TResponse, TPageParam> = {
  queries: Array<SingleInfiniteQueryOptions<TResponse, TPageParam>>;
  pageSize: number;
  flattenResponse: (queryResult: TResponse) => Array<TData>;
  compare: (a: TData, b: TData) => number;
};
