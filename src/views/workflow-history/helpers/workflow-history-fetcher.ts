import { InfiniteQueryObserver, type QueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type WorkflowHistoryQueryResult,
  type QueryResultOnChangeCallback,
  type ShouldContinueCallback,
  type WorkflowHistoryQueryKey,
} from './workflow-history-fetcher.types';

export default class WorkflowHistoryFetcher {
  private observer: InfiniteQueryObserver<
    GetWorkflowHistoryResponse,
    RequestError
  >;

  private unsubscribe: (() => void) | null = null;
  private isStarted = false;
  private shouldContinue: ShouldContinueCallback = () => true;

  constructor(
    private readonly queryClient: QueryClient,
    private readonly params: WorkflowHistoryQueryParams
  ) {
    this.observer = new InfiniteQueryObserver<
      GetWorkflowHistoryResponse,
      RequestError
    >(this.queryClient, {
      ...this.buildObserverOptions(this.params),
    });
  }

  onChange(callback: QueryResultOnChangeCallback): () => void {
    const current = this.getCurrentState();
    if (current) callback(current);
    return this.observer.subscribe((res: any) => {
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
    const shouldEnableQuery =
      (!fetchedFirstPage && shouldContinue(currentState)) || fetchedFirstPage;

    if (shouldEnableQuery) {
      this.observer.setOptions({
        ...this.buildObserverOptions(this.params),
        enabled: true,
      });
    }

    const emit = (res: WorkflowHistoryQueryResult) => {
      emitCount++;

      // Auto stop when there are no more pages (end of history) or when there is a fresh error happens after the start.
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

    // only start emit (fetching next pages) after the initial fetch is complete
    // first page is already fetched on the first subscription below
    if (fetchedFirstPage) {
      emit(currentState);
    }

    if (this.unsubscribe) {
      this.unsubscribe();
    }
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

    if (state.status === 'pending') {
      this.observer.setOptions({
        ...this.buildObserverOptions(this.params),
        enabled: true,
      });
    } else if (!state.isFetchingNextPage && state.hasNextPage)
      state.fetchNextPage();
  }

  getCurrentState(): WorkflowHistoryQueryResult {
    return this.observer.getCurrentResult();
  }

  private buildObserverOptions(params: WorkflowHistoryQueryParams) {
    return {
      queryKey: ['workflow_history', params] satisfies WorkflowHistoryQueryKey,
      queryFn: ({ queryKey: [_, qp], pageParam }: any) =>
        request(
          queryString.stringifyUrl({
            url: `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history`,
            query: {
              nextPage: pageParam,
              pageSize: qp.pageSize,
              waitForNewEvent: qp.waitForNewEvent ?? false,
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
