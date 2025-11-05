import { InfiniteQueryObserver, type QueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import request from '@/utils/request';

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
  private isStarted = false;
  private shouldContinue: ShouldContinueCallback = () => true;

  constructor(
    private readonly queryClient: QueryClient,
    private readonly params: WorkflowHistoryReactQueryParams
  ) {
    this.observer = new InfiniteQueryObserver(this.queryClient, {
      ...this.buildObserverOptions(this.params),
    });
  }

  onChange(callback: QueryResultOnChangeCallback): () => void {
    const current = this.getCurrentState();
    if (current) callback(current);
    return this.observer.subscribe((res) => {
      callback(res);
    });
  }

  start(shouldContinue: ShouldContinueCallback = () => true): void {
    if (shouldContinue) {
      this.shouldContinue = shouldContinue;
    }
    // If already started, return
    if (this.isStarted) return;
    this.isStarted = true;
    let emitCount = 0;
    const currentState = this.observer.getCurrentResult();
    const fetchedFirstPage = currentState.status !== 'pending';
    const shouldEnableQuery = !fetchedFirstPage && shouldContinue(currentState);

    if (shouldEnableQuery) {
      this.observer.setOptions({
        ...this.buildObserverOptions(this.params),
        enabled: true,
      });
    }

    const emit = (res: WorkflowHistoryQueryResult) => {
      emitCount++;

      // Auto stop when there are no more pages (end of history) or when there is an existing error from last start (emitCount === 1 means this is the first emit in the current start).
      // isError is true when the request failes and retries are exhausted.
      if (res.hasNextPage === false || (res.isError && emitCount > 1)) {
        this.stop();
        return;
      }

      // Drive pagination based on external predicate
      if (this.shouldContinue(res) && !res.isFetchingNextPage) {
        res.fetchNextPage();
      }
    };

    // Manual emit is needed to fetch the first next page after start is called.
    // While this manual emit is not needed for on the first history page as enabling the query will fetch it automatically.
    if (fetchedFirstPage) {
      emit(currentState);
    }

    // remove current listener (if exists) and add new one
    this.unsubscribe?.();
    this.unsubscribe = this.observer.subscribe((res) => emit(res));
  }

  stop(): void {
    this.isStarted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  destroy(): void {
    this.stop();
    this.observer.destroy();
  }

  fetchSingleNextPage(): void {
    const state = this.getCurrentState();
    // If the query is still pending, enable it to fetch the first page.
    // Otherwise, fetch the next page if it is not already fetching and there are more pages.
    if (state.status === 'pending') {
      this.observer.setOptions({
        ...this.buildObserverOptions(this.params),
        enabled: true,
      });
    } else if (!state.isFetchingNextPage && state.hasNextPage)
      state.fetchNextPage();
  }

  getCurrentState() {
    return this.observer.getCurrentResult();
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
              pageSize: params.pageSize,
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
