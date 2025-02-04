import { renderHook } from '@/test-utils/rtl';

import useKeepLoadingEvents from '../use-keep-loading-events';
import { type UseKeepLoadingEventsParams } from '../use-keep-loading-events.types';

describe('useKeepLoadingEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set reachedAvailableHistoryEnd to true when there are no more pages', () => {
    const { result } = setup({ hasNextPage: false });
    expect(result.current.reachedAvailableHistoryEnd).toBe(true);
  });

  it('should call fetchNextPage when shouldKeepLoading is true and there are more pages', () => {
    const { fetchNextPageMock } = setup({ shouldKeepLoading: true });

    expect(fetchNextPageMock).toHaveBeenCalled();
  });

  it('should not call fetchNextPage when shouldKeepLoading is false', () => {
    const { fetchNextPageMock } = setup({ shouldKeepLoading: false });

    expect(fetchNextPageMock).not.toHaveBeenCalled();
  });

  it('should not call fetchNextPage when isFetchingNextPage is true', () => {
    const { fetchNextPageMock } = setup({ isFetchingNextPage: true });

    expect(fetchNextPageMock).not.toHaveBeenCalled();
  });

  it('should not call fetchNextPage when stopAfterEndReached is true and reachedAvailableHistoryEnd is true', () => {
    const { fetchNextPageMock } = setup({
      hasNextPage: false,
      stopAfterEndReached: true,
    });

    expect(fetchNextPageMock).not.toHaveBeenCalled();
  });

  it('should set stoppedDueToError to true when isFetchNextPageError is true', () => {
    const { result, rerender } = setup({
      isFetchNextPageError: false,
    });

    expect(result.current.stoppedDueToError).toBe(false);

    rerender({ isFetchNextPageError: true });

    expect(result.current.stoppedDueToError).toBe(true);
  });

  it('should not call fetchNextPage when stoppedDueToError is true', () => {
    const { fetchNextPageMock } = setup({ isFetchNextPageError: true });

    expect(fetchNextPageMock).not.toHaveBeenCalled();
  });

  it('should return isLoadingMore as true when keepLoadingMore conditions are met', () => {
    const { result, rerender } = setup({
      shouldKeepLoading: true,
      stopAfterEndReached: true,
      hasNextPage: true,
      isFetchNextPageError: false,
    });

    expect(result.current.isLoadingMore).toBe(true);

    rerender({
      shouldKeepLoading: true,
      hasNextPage: true,
      isFetchNextPageError: false,
      // stopAfterEndReached and simulate end by empty events page
      stopAfterEndReached: true,
      isLastPageEmpty: true,
    });
    expect(result.current.isLoadingMore).toBe(false);

    rerender({
      shouldKeepLoading: true,
      stopAfterEndReached: true,
      hasNextPage: true,
      // adding error
      isFetchNextPageError: true,
    });
    expect(result.current.isLoadingMore).toBe(false);
  });
});

function setup(params: Partial<UseKeepLoadingEventsParams>) {
  const fetchNextPage = jest.fn();
  const { result, rerender } = renderHook(
    (runTimeChanges?: Partial<UseKeepLoadingEventsParams>) =>
      useKeepLoadingEvents({
        shouldKeepLoading: true,
        stopAfterEndReached: true,
        isLastPageEmpty: false,
        hasNextPage: true,
        fetchNextPage,
        isFetchingNextPage: false,
        isFetchNextPageError: false,
        ...params,
        ...runTimeChanges,
      })
  );

  return { result, rerender, fetchNextPageMock: fetchNextPage };
}
