import { InfiniteQueryObserver, type QueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import request from '@/utils/request';

import {
  WORKFLOW_HISTORY_FIRST_PAGE_SIZE_CONFIG,
  WORKFLOW_HISTORY_PAGE_SIZE_CONFIG,
} from '../config/workflow-history-page-size.config';

import {
  type WorkflowHistoryQueryResult,
  type QueryResultOnChangeCallback,
  type ShouldContinueCallback,
  type WorkflowHistoryReactQueryParams,
  type WorkflowHistoryInfiniteQueryOptions,
  type WorkflowHistoryInfiniteQueryObserver,
} from './workflow-history-fetcher.types';

export default class WorkflowHistoryFetcher {
  private observer: WorkflowHistoryInfiniteQueryObserver;
  private unsubscribe: (() => void) | null = null;
  private shouldContinue: ShouldContinueCallback = () => true;

  /**
   * Creates a new WorkflowHistoryFetcher instance.
   *
   * @param queryClient - The React Query client instance
   * @param params - Parameters for the workflow history query (domain, cluster, workflowId, runId, etc.)
   */
  constructor(
    private readonly queryClient: QueryClient,
    private readonly params: WorkflowHistoryReactQueryParams
  ) {
    this.observer = new InfiniteQueryObserver(this.queryClient, {
      ...this.buildObserverOptions(this.params),
    });
  }

  /**
   * Subscribes to query state changes. The callback will be invoked immediately
   * with the current state, and then whenever the query state changes.
   *
   * @param callback - Function to call when the query state changes
   * @returns Unsubscribe function to stop receiving updates
   */
  onChange(callback: QueryResultOnChangeCallback): () => void {
    const current = this.getCurrentState();
    if (current) callback(current);
    return this.observer.subscribe((res) => {
      callback(res);
    });
  }

  /**
   * Starts automatic pagination of workflow history. The fetcher will automatically
   * fetch the next page whenever the `shouldContinue` callback returns true.
   * Pagination will automatically stop when there are no more pages, or an error occurs.
   *
   * If called multiple times, previous subscriptions are cleaned up and a fresh
   * pagination cycle begins.
   *
   * @param shouldContinue - Callback that determines whether to continue fetching pages.
   *   Receives the current query state and should return true to continue, false to stop.
   *   Defaults to always returning true.
   */
  start(shouldContinue: ShouldContinueCallback = () => true): void {
    this.shouldContinue = shouldContinue;

    this.unsubscribe?.();
    this.unsubscribe = null;

    const currentState = this.observer.getCurrentResult();
    const hasFetchedFirstPage = currentState.status !== 'pending';
    if (!hasFetchedFirstPage && this.shouldContinue(currentState)) {
      this.enableQuery();
    }

    const handleStateChange = this.createStateChangeHandler();

    // Manually trigger handler if first page of history has already been loaded
    // Subscriptions only fire on future state changes
    if (hasFetchedFirstPage) {
      handleStateChange(currentState);
    }

    this.unsubscribe = this.observer.subscribe((res) => handleStateChange(res));
  }

  /**
   * Stops automatic pagination. This will cancel any ongoing subscriptions,
   * but will not destroy the fetcher instance.
   * Use `destroy()` to fully clean up the fetcher.
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Destroys the fetcher instance. This calls `stop()` to clean up subscriptions
   * and then destroys the underlying React Query observer. After calling this,
   * the fetcher instance should not be used.
   */
  destroy(): void {
    this.stop();
    this.observer.destroy();
  }

  /**
   * Manually fetches a single next page of workflow history. If the query is
   * still pending (first page not fetched), this will enable the query, fetching
   * the first page. Otherwise, it will fetch the next page if available and
   * not already fetching.
   *
   * This method does not start automatic pagination - use `start()` for that.
   */
  fetchSingleNextPage(): void {
    const state = this.getCurrentState();
    if (state.status === 'pending') {
      this.enableQuery();
    } else if (!state.isFetchingNextPage && state.hasNextPage)
      state.fetchNextPage();
  }

  /**
   * Gets the current state of the workflow history query. This includes
   * loading status, data, error information, and pagination state.
   *
   * @returns The current query result state
   */
  getCurrentState() {
    return this.observer.getCurrentResult();
  }

  private enableQuery() {
    this.observer.setOptions({
      ...this.buildObserverOptions(this.params),
      enabled: true,
    });
  }

  private createStateChangeHandler(): (
    res: WorkflowHistoryQueryResult
  ) => void {
    let stateChangeCount = 0;

    return (res: WorkflowHistoryQueryResult) => {
      stateChangeCount++;

      if (res.hasNextPage === false || (res.isError && stateChangeCount > 1)) {
        this.stop();
        return;
      }

      if (!this.shouldContinue(res) || res.isFetchingNextPage) return;
      res.fetchNextPage();
    };
  }

  private buildObserverOptions(
    queryParams: WorkflowHistoryReactQueryParams
  ): WorkflowHistoryInfiniteQueryOptions {
    return {
      queryKey: ['workflow_history', queryParams],
      queryFn: ({ queryKey: [_, params], pageParam }) =>
        request(
          queryString.stringifyUrl({
            url: `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}/history`,
            query: {
              nextPage: pageParam,
              pageSize: pageParam
                ? WORKFLOW_HISTORY_PAGE_SIZE_CONFIG
                : WORKFLOW_HISTORY_FIRST_PAGE_SIZE_CONFIG,
              waitForNewEvent: params.waitForNewEvent ?? false,
            } satisfies WorkflowHistoryQueryParams,
          })
        ).then((res) => res.json()),
      initialPageParam: undefined,
      getNextPageParam: (lastPage: GetWorkflowHistoryResponse) => {
        return lastPage.nextPageToken ? lastPage.nextPageToken : undefined;
      },
      retry: 3,
      retryDelay: 3000,
      enabled: false,
    };
  }
}
