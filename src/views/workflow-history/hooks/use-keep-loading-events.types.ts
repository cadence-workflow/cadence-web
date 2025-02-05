export type UseKeepLoadingEventsParams = {
  shouldKeepLoading: boolean;
  isLastPageEmpty: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  stopAfterEndReached?: boolean;
};
