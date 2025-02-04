import { useEffect, useRef } from 'react';

import { type UseKeepLoadingEventsParams } from './use-keep-loading-events.types';

export default function useKeepLoadingEvents({
  shouldKeepLoading,
  isLastPageEmpty,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  stopAfterEndReached,
  isFetchNextPageError,
}: UseKeepLoadingEventsParams) {
  const reachedAvailableHistoryEnd = useRef(false);

  const stoppedDueToError = useRef(isFetchNextPageError);

  // update reachedAvailableHistoryEnd
  const reached = !hasNextPage || (hasNextPage && isLastPageEmpty);
  if (reached && !reachedAvailableHistoryEnd.current)
    reachedAvailableHistoryEnd.current = true;

  // update stoppedDueToError
  if (isFetchNextPageError && !stoppedDueToError.current)
    stoppedDueToError.current = true;

  const canLoadMore =
    shouldKeepLoading &&
    !(stopAfterEndReached && reachedAvailableHistoryEnd.current) &&
    !stoppedDueToError.current &&
    hasNextPage;

  useEffect(() => {
    if (canLoadMore && !isFetchingNextPage) fetchNextPage();
  }, [isFetchingNextPage, fetchNextPage, canLoadMore]);

  return {
    reachedAvailableHistoryEnd: reachedAvailableHistoryEnd.current,
    stoppedDueToError: stoppedDueToError.current,
    isLoadingMore: canLoadMore,
  };
}
