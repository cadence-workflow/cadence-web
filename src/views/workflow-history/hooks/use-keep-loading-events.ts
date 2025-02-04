import { useEffect, useRef } from 'react';

import { type UseKeepLoadingEventsParams } from './use-keep-loading-events.types';

export default function useKeepLoadingEvents({
  keepLoading,
  resultPages,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  stopAfterEndReached,
  isFetchNextPageError,
}: UseKeepLoadingEventsParams) {
  const reachedAvailableHistoryEnd = useRef(false);

  const stoppedDueToError = useRef(isFetchNextPageError);

  // update reachedAvailableHistoryEnd
  const reached =
    !hasNextPage ||
    (hasNextPage &&
      resultPages[resultPages.length - 1].history?.events.length === 0);
  if (reached && !reachedAvailableHistoryEnd.current)
    reachedAvailableHistoryEnd.current = true;

  // update stoppedDueToError
  if (isFetchNextPageError && !stoppedDueToError.current)
    stoppedDueToError.current = true;

  const keepLoadingMore =
    keepLoading &&
    !(stopAfterEndReached && reachedAvailableHistoryEnd.current) &&
    !stoppedDueToError.current &&
    hasNextPage;

  useEffect(() => {
    if (!keepLoadingMore) return;
    if (keepLoading && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    keepLoadingMore,
    keepLoading,
  ]);

  return {
    reachedAvailableHistoryEnd: reachedAvailableHistoryEnd.current,
    stoppedDueToError: stoppedDueToError.current,
    isLoadingMore: keepLoadingMore,
  };
}
