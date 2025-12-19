import { QueryClient } from '@tanstack/react-query';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import workflowHistoryMultiPageFixture from '../../__fixtures__/workflow-history-multi-page-fixture';
import { workflowPageUrlParams } from '../../__fixtures__/workflow-page-url-params';
import WorkflowHistoryFetcher from '../../helpers/workflow-history-fetcher';
import useWorkflowHistoryFetcher from '../use-workflow-history-fetcher';

jest.mock('../../helpers/workflow-history-fetcher');

const mockParams = {
  ...workflowPageUrlParams,
  pageSize: 50,
  waitForNewEvent: true,
};
let mockFetcherInstance: jest.Mocked<WorkflowHistoryFetcher>;
let mockOnChangeCallback: jest.Mock;
let mockUnsubscribe: jest.Mock;

function setup() {
  const mockOnEventsChange = jest.fn();
  const hookResult = renderHook(() =>
    useWorkflowHistoryFetcher(mockParams, {
      onEventsChange: mockOnEventsChange,
    })
  );

  return {
    ...hookResult,
    mockFetcherInstance,
    mockOnChangeCallback,
    mockUnsubscribe,
    mockOnEventsChange,
  };
}

describe(useWorkflowHistoryFetcher.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockOnChangeCallback = jest.fn();
    mockUnsubscribe = jest.fn();

    mockFetcherInstance = {
      start: jest.fn(),
      stop: jest.fn(),
      destroy: jest.fn(),
      fetchSingleNextPage: jest.fn(),
      onChange: jest.fn((callback) => {
        mockOnChangeCallback.mockImplementation(callback);
        return mockUnsubscribe;
      }),
      getCurrentState: jest.fn(() => ({
        data: undefined,
        error: null,
        isError: false,
        isLoading: false,
        isPending: true,
        isFetchingNextPage: false,
        hasNextPage: false,
        status: 'pending' as const,
      })),
    } as unknown as jest.Mocked<WorkflowHistoryFetcher>;

    (
      WorkflowHistoryFetcher as jest.MockedClass<typeof WorkflowHistoryFetcher>
    ).mockImplementation(() => mockFetcherInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a WorkflowHistoryFetcher instance with correct params', () => {
    setup();

    expect(WorkflowHistoryFetcher).toHaveBeenCalledWith(
      expect.any(QueryClient),
      mockParams
    );
    expect(WorkflowHistoryFetcher).toHaveBeenCalledTimes(1);
  });

  it('should reuse the same fetcher instance on re-renders', () => {
    const { rerender } = setup();

    rerender();
    rerender();

    expect(WorkflowHistoryFetcher).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to fetcher state changes on mount', () => {
    setup();

    expect(mockFetcherInstance.onChange).toHaveBeenCalledTimes(1);
  });

  it('should start fetcher to load first page on mount', () => {
    setup();

    expect(mockFetcherInstance.start).toHaveBeenCalledWith(
      expect.any(Function),
      undefined
    );
    expect(mockFetcherInstance.start).toHaveBeenCalledTimes(1);
  });

  it('should return initial history query state', () => {
    const { result } = setup();

    expect(result.current.historyQuery).toBeDefined();
    expect(result.current.historyQuery.isPending).toBe(true);
  });

  it('should update historyQuery when fetcher state changes', async () => {
    const { result, mockOnChangeCallback } = setup();

    const newState = {
      data: {
        pages: [workflowHistoryMultiPageFixture[0]],
        pageParams: [],
      },
      error: null,
      isError: false,
      isLoading: false,
      isPending: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      status: 'success' as const,
    };

    act(() => {
      mockOnChangeCallback(newState);
    });

    await waitFor(() => {
      expect(result.current.historyQuery.status).toBe('success');
    });
  });

  it('should call fetcher.start() with custom shouldContinue callback passed to startLoadingHistory', () => {
    const { result, mockFetcherInstance } = setup();
    const customShouldContinue = jest.fn(() => false);

    act(() => {
      result.current.startLoadingHistory(customShouldContinue);
    });

    expect(mockFetcherInstance.start).toHaveBeenCalledWith(
      customShouldContinue,
      undefined
    );
  });

  it('should call fetcher.stop() within stopLoadingHistory', () => {
    const { result, mockFetcherInstance } = setup();

    act(() => {
      result.current.stopLoadingHistory();
    });

    expect(mockFetcherInstance.stop).toHaveBeenCalledTimes(1);
  });

  it('should call fetcher.fetchSingleNextPage() within fetchSingleNextPage', () => {
    const { result, mockFetcherInstance } = setup();

    act(() => {
      result.current.fetchSingleNextPage();
    });

    expect(mockFetcherInstance.fetchSingleNextPage).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from onChange when unmounted', () => {
    const { unmount, mockUnsubscribe } = setup();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should call fetcher.unmount() when component unmounts', () => {
    const { unmount, mockFetcherInstance } = setup();

    unmount();

    expect(mockFetcherInstance.destroy).toHaveBeenCalledTimes(1);
  });

  it('should return all expected methods and state', () => {
    const { result } = setup();

    expect(result.current).toHaveProperty('historyQuery');
    expect(result.current).toHaveProperty('startLoadingHistory');
    expect(result.current).toHaveProperty('stopLoadingHistory');
    expect(result.current).toHaveProperty('fetchSingleNextPage');
    expect(typeof result.current.startLoadingHistory).toBe('function');
    expect(typeof result.current.stopLoadingHistory).toBe('function');
    expect(typeof result.current.fetchSingleNextPage).toBe('function');
  });
});
