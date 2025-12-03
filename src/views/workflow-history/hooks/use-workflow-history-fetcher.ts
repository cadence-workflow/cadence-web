import { useCallback, useEffect, useRef } from 'react';

import {
  type InfiniteData,
  type InfiniteQueryObserverResult,
  useQueryClient,
} from '@tanstack/react-query';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import useThrottledState from '@/hooks/use-throttled-state';
import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
  type RouteParams,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { type RequestError } from '@/utils/request/request-error';

import WorkflowHistoryFetcher from '../helpers/workflow-history-fetcher';
import { type ShouldContinueCallback } from '../helpers/workflow-history-fetcher.types';

export default function useWorkflowHistoryFetcher(
  params: WorkflowHistoryQueryParams & RouteParams,
  onEventsChange: (events: HistoryEvent[]) => void,
  throttleMs: number = 2000
) {
  const queryClient = useQueryClient();
  const fetcherRef = useRef<WorkflowHistoryFetcher | null>(null);

  if (!fetcherRef.current) {
    fetcherRef.current = new WorkflowHistoryFetcher(queryClient, params);

    // Fetch first page
    fetcherRef.current.start((state) => !state?.data?.pages?.length);
  }

  const [historyQuery, setHistoryQuery] = useThrottledState<
    InfiniteQueryObserverResult<
      InfiniteData<GetWorkflowHistoryResponse>,
      RequestError
    >
  >(fetcherRef.current.getCurrentState(), throttleMs, {
    leading: true,
    trailing: true,
  });

  useEffect(() => {
    if (!fetcherRef.current) return;
    let lastFlattenedPagesCount = -1;
    const unsubscribe = fetcherRef.current.onChange((state) => {
      const pagesCount = state.data?.pages?.length || 0;
      // If the pages count is greater than the last flattened pages count, then we need to flatten the pages and call the onEventsChange callback
      // Depending on ref variable instead of historyQuery is because historyQuery is throttled.
      if (pagesCount > lastFlattenedPagesCount) {
        lastFlattenedPagesCount = pagesCount;
        onEventsChange(
          state.data?.pages?.flatMap((page) => page.history?.events || []) || []
        );
      }
      // immediately set if there is the first page without throttling other wise throttle
      const executeImmediately = pagesCount <= 1;
      setHistoryQuery(() => state, executeImmediately);
    });

    return () => {
      unsubscribe();
    };
  }, [setHistoryQuery, onEventsChange]);

  useEffect(() => {
    return () => {
      fetcherRef.current?.destroy();
    };
  }, []);

  const startLoadingHistory = useCallback(
    (shouldContinue: ShouldContinueCallback = () => true) => {
      if (!fetcherRef.current) return;
      fetcherRef.current.start(shouldContinue);
    },
    []
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
