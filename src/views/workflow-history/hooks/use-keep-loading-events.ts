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
  continueLoadingAfterError,
}: UseKeepLoadingEventsParams) {
  const reachedAvailableHistoryEnd = useRef(false);

  const hadErrorOnce = useRef(isFetchNextPageError);
  // update reachedAvailableHistoryEnd
  const reached =
    !hasNextPage || (hasNextPage && isLastPageEmpty && !isFetchNextPageError);
  if (reached && !reachedAvailableHistoryEnd.current)
    reachedAvailableHistoryEnd.current = true;

  // update hadErrorOnce
  if (isFetchNextPageError && !hadErrorOnce.current)
    hadErrorOnce.current = true;

  const stopDueToError =
    isFetchNextPageError ||
    (hadErrorOnce.current && !continueLoadingAfterError);

  const canLoadMore =
    shouldKeepLoading &&
    !(stopAfterEndReached && reachedAvailableHistoryEnd.current) &&
    !stopDueToError &&
    hasNextPage;

  useEffect(() => {
    if (canLoadMore && !isFetchingNextPage) fetchNextPage();
  }, [isFetchingNextPage, fetchNextPage, canLoadMore]);

  return {
    reachedAvailableHistoryEnd: reachedAvailableHistoryEnd.current,
    stoppedDueToError: stopDueToError,
    isLoadingMore: canLoadMore,
  };
}
