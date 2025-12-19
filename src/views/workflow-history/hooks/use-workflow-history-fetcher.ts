import { useCallback, useEffect, useRef } from 'react';

import {
  type InfiniteData,
  type InfiniteQueryObserverResult,
  useQueryClient,
} from '@tanstack/react-query';

import useThrottledState from '@/hooks/use-throttled-state';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { type RequestError } from '@/utils/request/request-error';
import WorkflowHistoryFetcher from '@/views/workflow-history/helpers/workflow-history-fetcher';
import { type ShouldContinueCallback } from '@/views/workflow-history/helpers/workflow-history-fetcher.types';

import {
  type UseWorkflowHistoryFetcherParams,
  type UseWorkflowHistoryFetcherOptions,
} from './use-workflow-history-fetcher.types';

export default function useWorkflowHistoryFetcher(
  params: UseWorkflowHistoryFetcherParams,
  {
    onEventsChange,
    renderThrottleMs = 2000,
    fetchThrottleMs,
  }: UseWorkflowHistoryFetcherOptions
) {
  const queryClient = useQueryClient();
  const fetcherRef = useRef<WorkflowHistoryFetcher | null>(null);

  if (!fetcherRef.current) {
    fetcherRef.current = new WorkflowHistoryFetcher(queryClient, params);
    fetcherRef.current.start(
      (state) => !state?.data?.pages?.length,
      fetchThrottleMs
    );
  }

  useEffect(() => {
    return () => {
      fetcherRef.current?.destroy();
    };
  }, []);

  const [historyQuery, setHistoryQuery] = useThrottledState<
    InfiniteQueryObserverResult<
      InfiniteData<GetWorkflowHistoryResponse>,
      RequestError
    >
  >(fetcherRef.current.getCurrentState(), renderThrottleMs, {
    leading: true,
    trailing: true,
  });

  useEffect(() => {
    if (!fetcherRef.current) return;
    let lastFlattenedPagesCount = -1;
    const unsubscribe = fetcherRef.current.onChange((state) => {
      const pagesCount = state.data?.pages?.length || 0;
      if (pagesCount > lastFlattenedPagesCount) {
        lastFlattenedPagesCount = pagesCount;
        onEventsChange(
          state.data?.pages?.flatMap((page) => page.history?.events || []) || []
        );
      }

      const executeImmediately = pagesCount <= 1;
      setHistoryQuery(() => state, executeImmediately);
    });

    return () => {
      unsubscribe();
    };
  }, [setHistoryQuery, onEventsChange]);

  const startLoadingHistory = useCallback(
    (shouldContinue: ShouldContinueCallback = () => true) => {
      if (!fetcherRef.current) return;
      fetcherRef.current.start(shouldContinue, fetchThrottleMs);
    },
    [fetchThrottleMs]
  );

  const stopLoadingHistory = useCallback(() => {
    if (!fetcherRef.current) return;
    fetcherRef.current.stop();
  }, []);

  const fetchSingleNextPage = useCallback(() => {
    if (!fetcherRef.current) return;
    fetcherRef.current.fetchSingleNextPage();
  }, []);

  return {
    historyQuery,
    startLoadingHistory,
    stopLoadingHistory,
    fetchSingleNextPage,
  };
}
