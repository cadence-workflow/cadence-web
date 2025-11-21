import { QueryClient } from '@tanstack/react-query';
import { HttpResponse } from 'msw';

import { waitFor } from '@/test-utils/rtl';

import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import mswMockEndpoints from '@/test-utils/msw-mock-handlers/helper/msw-mock-endpoints';

import workflowHistoryMultiPageFixture from '../../__fixtures__/workflow-history-multi-page-fixture';
import WorkflowHistoryFetcher from '../workflow-history-fetcher';

const RETRY_DELAY = 3000;
const RETRY_COUNT = 3;

let queryClient: QueryClient;
let hoistedFetcher: WorkflowHistoryFetcher;

jest.mock(
  '@/views/workflow-history/config/workflow-history-page-size.config',
  () => ({
    __esModule: true,
    WORKFLOW_HISTORY_FIRST_PAGE_SIZE_CONFIG: 200,
    WORKFLOW_HISTORY_PAGE_SIZE_CONFIG: 1000,
  })
);

describe(WorkflowHistoryFetcher.name, () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
    hoistedFetcher?.destroy();
  });

  it('should return the current query state from getCurrentState', async () => {
    const { fetcher } = setup(queryClient);

    const initialState = fetcher.getCurrentState();
    expect(initialState.data).toBeUndefined();
    expect(initialState.status).toBe('pending');
  });

  it('should call onChange callback on state changes', async () => {
    const { fetcher } = setup(queryClient);
    const callback = jest.fn();

    fetcher.onChange(callback);
    const initialCallCount = callback.mock.calls.length;

    fetcher.start((state) => !state?.data?.pages?.length);

    await waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  it('should return unsubscribe function', async () => {
    const { fetcher } = setup(queryClient);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const unsubscribe1 = fetcher.onChange(callback1);
    fetcher.onChange(callback2);

    // Fetch the first page
    fetcher.start((state) => !state?.data?.pages?.length);

    await waitFor(() => {
      expect(callback1.mock.calls.length).toEqual(callback2.mock.calls.length);
      expect(callback1.mock.calls.length).toBeGreaterThan(1);
    });

    const countBeforeUnsubscribe = callback1.mock.calls.length;
    unsubscribe1();

    fetcher.fetchSingleNextPage();

    await waitFor(() => {
      expect(callback2.mock.calls.length).toBeGreaterThan(
        countBeforeUnsubscribe
      );
    });
  });

  it('should not fetch any pages if shouldContinue callback returns false', async () => {
    const { fetcher } = setup(queryClient);
    const shouldContinue = jest.fn(() => false);

    fetcher.start(shouldContinue);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.isFetching).toBe(false);
    });

    const state = fetcher.getCurrentState();
    expect(state.data?.pages || []).toHaveLength(0);
  });

  it('should stop after shouldContinue returns false', async () => {
    const { fetcher } = setup(queryClient);
    const shouldContinue = jest.fn((state) => {
      return (state.data?.pages.length || 0) < 2;
    });

    fetcher.start(shouldContinue);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.isFetching).toBe(false);
      expect(state.data?.pages).toHaveLength(2);
    });
  });

  it('should load all pages and auto-stop when there are no more pages', async () => {
    const { fetcher } = setup(queryClient);

    fetcher.start();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.hasNextPage).toBe(false);
      expect(state.data?.pages).toHaveLength(3);
    });
  });

  it('should auto-stop on error after initial success', async () => {
    jest.useFakeTimers();

    try {
      const { fetcher } = setup(queryClient, { failOnPages: [2] });

      fetcher.start();

      // Wait for first page to load successfully
      await waitFor(() => {
        const state = fetcher.getCurrentState();
        expect(state.data?.pages).toHaveLength(1);
      });

      // Fast-forward through retry delays
      await jest.advanceTimersByTimeAsync(RETRY_COUNT * RETRY_DELAY);

      await waitFor(() => {
        const state = fetcher.getCurrentState();
        expect(state.isFetching).toBe(false);
        expect(state.isError).toBe(true);
        expect(state.data?.pages).toHaveLength(1);
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it('should allow manual stop for loading all pages', async () => {
    const { fetcher } = setup(queryClient);

    let stopped = false;
    fetcher.onChange((state) => {
      if (state.data?.pages.length === 1 && !stopped) {
        stopped = true;
        fetcher.stop();
      }
    });

    fetcher.start();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.isFetching).toBe(false);
      expect(state.data?.pages).toHaveLength(1);
    });
  });

  it('should allow start again after stop', async () => {
    const { fetcher } = setup(queryClient);

    let stopped = false;
    fetcher.onChange((state) => {
      if (state.data?.pages.length === 1 && !stopped) {
        stopped = true;
        fetcher.stop();
      }
    });

    fetcher.start();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.isFetching).toBe(false);
      expect(state.data?.pages).toHaveLength(1);
    });

    fetcher.start();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.isFetching).toBe(false);
    });

    const finalState = fetcher.getCurrentState();
    expect(finalState.data?.pages).toHaveLength(3);
  });

  it('should fetch next page when available', async () => {
    const { fetcher } = setup(queryClient);

    fetcher.start((state) => !state?.data?.pages?.length);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.data?.pages).toHaveLength(1);
    });
    fetcher.stop();

    fetcher.fetchSingleNextPage();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.data?.pages).toHaveLength(2);
    });
  });

  it('should not fetch when already fetching', async () => {
    const { fetcher } = setup(queryClient);

    fetcher.start((state) => !state?.data?.pages?.length);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.data?.pages).toHaveLength(1);
    });
    fetcher.stop();

    // fetching twice should not fetch again
    fetcher.fetchSingleNextPage();
    fetcher.fetchSingleNextPage();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(!state.isFetchingNextPage).toBe(true);
    });

    const state = fetcher.getCurrentState();
    expect(state.data?.pages).toHaveLength(2);
  });

  it('should not fetch when no next page available', async () => {
    const { fetcher } = setup(queryClient);

    fetcher.start();

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.hasNextPage).toBe(false);
    });

    const pageCountBefore = fetcher.getCurrentState().data?.pages.length;
    fetcher.fetchSingleNextPage();

    const state = fetcher.getCurrentState();
    expect(state.data?.pages.length).toBe(pageCountBefore);
  });

  it('should use WORKFLOW_HISTORY_FIRST_PAGE_SIZE_CONFIG for the first page', async () => {
    const { fetcher, getCapturedPageSizes } = setup(queryClient);

    fetcher.start((state) => !state?.data?.pages?.length);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.data?.pages).toHaveLength(1);
    });

    const pageSizes = getCapturedPageSizes();
    expect(pageSizes[0]).toBe('200');
  });

  it('should use WORKFLOW_HISTORY_PAGE_SIZE_CONFIG for subsequent pages', async () => {
    const { fetcher, getCapturedPageSizes } = setup(queryClient);

    fetcher.start((state) => (state.data?.pages.length || 0) < 3);

    await waitFor(() => {
      const state = fetcher.getCurrentState();
      expect(state.data?.pages).toHaveLength(3);
    });

    const pageSizes = getCapturedPageSizes();
    expect(pageSizes[1]).toBe('1000');
    expect(pageSizes[2]).toBe('1000');
  });
});

function setup(client: QueryClient, options: { failOnPages?: number[] } = {}) {
  const params = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    pageSize: 10,
  };

  const { getCapturedPageSizes } = mockHistoryEndpoint(
    workflowHistoryMultiPageFixture,
    options.failOnPages
  );
  const fetcher = new WorkflowHistoryFetcher(client, params);
  hoistedFetcher = fetcher;

  const waitForData = async () => {
    let unsubscribe: (() => void) | undefined;
    await new Promise<void>((resolve) => {
      unsubscribe = fetcher.onChange((state) => {
        if (state.data !== undefined) {
          resolve();
        }
      });
    });
    unsubscribe?.();
  };
  return {
    fetcher,
    params,
    waitForData,
    getCapturedPageSizes,
  };
}

function mockHistoryEndpoint(
  responses: GetWorkflowHistoryResponse[],
  failOnPages: number[] = []
) {
  const capturedPageSizes: string[] = [];

  mswMockEndpoints([
    {
      path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
      httpMethod: 'GET',
      mockOnce: false, // Persist across multiple requests
      httpResolver: async ({ request }) => {
        const url = new URL(request.url);
        const nextPage = url.searchParams.get('nextPage');
        const pageSize = url.searchParams.get('pageSize');

        capturedPageSizes.push(pageSize ?? '');

        // Determine current page number based on nextPage param
        let pageNumber = 1;
        if (!nextPage) {
          pageNumber = 1;
        } else if (nextPage === 'page2') {
          pageNumber = 2;
        } else if (nextPage === 'page3') {
          pageNumber = 3;
        }

        // Check if this page should fail
        if (failOnPages.includes(pageNumber)) {
          return HttpResponse.json(
            { message: 'Request failed' },
            { status: 500 }
          );
        }

        // Map page number to response index (0-indexed)
        const responseIndex = pageNumber - 1;
        const response =
          responses[responseIndex] || responses[responses.length - 1];
        return HttpResponse.json(response);
      },
    },
  ]);

  return {
    getCapturedPageSizes: () => capturedPageSizes,
  };
}
