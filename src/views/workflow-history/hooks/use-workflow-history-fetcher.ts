import { useCallback, useEffect, useRef } from 'react';

import {
  type InfiniteData,
  type InfiniteQueryObserverResult,
  useQueryClient,
} from '@tanstack/react-query';

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
  throttleMs: number = 2000
) {
  const queryClient = useQueryClient();
  const fetcherRef = useRef<WorkflowHistoryFetcher | null>(null);

  if (!fetcherRef.current) {
    fetcherRef.current = new WorkflowHistoryFetcher(queryClient, params);
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

    const unsubscribe = fetcherRef.current.onChange((state) => {
      const pagesCount = state.data?.pages?.length || 0;
      // immediately set if there is the first page without throttling other wise throttle
      const executeImmediately = pagesCount <= 1;
      setHistoryQuery(() => state, executeImmediately);
    });

    // Fetch first page
    fetcherRef.current.start((state) => !state?.data?.pages?.length);

    return () => {
      unsubscribe();
    };
  }, [setHistoryQuery]);

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
