import { Suspense } from 'react';

import { HttpResponse } from 'msw';
import { VirtuosoMockContext } from 'react-virtuoso';

import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@/test-utils/rtl';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import * as usePageFiltersModule from '@/components/page-filters/hooks/use-page-filters';
import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';
import type workflowPageQueryParamsConfig from '@/views/workflow-page/config/workflow-page-query-params.config';

import { completedActivityTaskEvents } from '../../workflow-history/__fixtures__/workflow-history-activity-events';
import { completedDecisionTaskEvents } from '../../workflow-history/__fixtures__/workflow-history-decision-events';
import { WorkflowHistoryContext } from '../../workflow-history/workflow-history-context-provider/workflow-history-context-provider';
import WorkflowHistoryV2 from '../workflow-history-v2';

jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [{ historySelectedEventId: '1' }, jest.fn()])
);

// Mock the hook to use minimal throttle delay for faster tests
jest.mock('../../workflow-history/hooks/use-workflow-history-fetcher', () => {
  const actual = jest.requireActual(
    '../../workflow-history/hooks/use-workflow-history-fetcher'
  );
  return {
    __esModule: true,
    default: jest.fn((params, onEventsChange) =>
      actual.default(params, onEventsChange, 0)
    ), // 0ms throttle for tests
  };
});

jest.mock('@/components/page-filters/hooks/use-page-filters', () =>
  jest.fn().mockReturnValue({})
);

jest.mock('../config/workflow-history-filters.config', () => []);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>keep loading events</div>)
);

jest.mock('../workflow-history-header/workflow-history-header', () =>
  jest.fn(
    ({
      isUngroupedHistoryViewEnabled,
      onClickGroupModeToggle,
      pageFiltersProps,
    }) => (
      <div data-testid="workflow-history-header">
        <div>Workflow history Header</div>
        <div data-testid="is-ungrouped-enabled">
          {String(isUngroupedHistoryViewEnabled)}
        </div>
        <div data-testid="active-filters-count">
          {pageFiltersProps.activeFiltersCount}
        </div>
        <button
          data-testid="toggle-group-mode"
          onClick={onClickGroupModeToggle}
        >
          Toggle Group Mode
        </button>
      </div>
    )
  )
);

jest.mock(
  '../workflow-history-grouped-table/workflow-history-grouped-table',
  () =>
    jest.fn(() => (
      <div data-testid="workflow-history-grouped-table">Grouped Table</div>
    ))
);

jest.mock('@/utils/decode-url-params', () => jest.fn((params) => params));

const mockResetAllFilters = jest.fn();

describe(WorkflowHistoryV2.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders page header correctly', async () => {
    await setup({});
    expect(
      await screen.findByText('Workflow history Header')
    ).toBeInTheDocument();
  });

  it('renders grouped table', async () => {
    await setup({});
    expect(
      await screen.findByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
  });

  it('throws an error if the request fails', async () => {
    try {
      await act(async () => await setup({ error: true }));
    } catch (error) {
      expect((error as Error)?.message).toBe(
        'Failed to fetch workflow history'
      );
    }
  });

  it('throws an error if the workflow summary request fails', async () => {
    try {
      await act(async () => await setup({ summaryError: true }));
    } catch (error) {
      expect((error as Error)?.message).toBe(
        'Failed to fetch workflow summary'
      );
    }
  });

  it('should show loading while searching for initial selectedEventId', async () => {
    const { getRequestResolver } = await setup({
      resolveLoadMoreManually: true,
      pageQueryParamsValues: {
        historySelectedEventId: completedDecisionTaskEvents[1].eventId,
      },
      hasNextPage: true,
    });

    await waitFor(() => {
      expect(screen.getByText('keep loading events')).toBeInTheDocument();
    });

    // Load first page
    await act(async () => {
      const resolver = getRequestResolver();
      resolver({
        history: {
          events: [completedDecisionTaskEvents[0]],
        },
        archived: false,
        nextPageToken: 'mock-next-page-token',
        rawHistory: [],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('keep loading events')).toBeInTheDocument();
    });

    // Load second page
    await act(async () => {
      const secondPageResolver = getRequestResolver();
      secondPageResolver({
        history: {
          events: [completedDecisionTaskEvents[1]],
        },
        archived: false,
        nextPageToken: 'mock-next-page-token',
        rawHistory: [],
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('keep loading events')).not.toBeInTheDocument();
    });
  });

  it('should render grouped table by default when ungroupedHistoryViewEnabled is not set and user preference is false', async () => {
    await setup({ ungroupedViewPreference: false });
    expect(
      await screen.findByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render grouped table by default when ungroupedHistoryViewEnabled is not set and user preference is null', async () => {
    await setup({ ungroupedViewPreference: null });
    expect(
      await screen.findByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render ungrouped table when ungroupedHistoryViewEnabled query param is true', async () => {
    await setup({
      pageQueryParamsValues: {
        ungroupedHistoryViewEnabled: true,
      },
    });
    expect(await screen.findByText('WIP: ungrouped table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('workflow-history-grouped-table')
    ).not.toBeInTheDocument();
  });

  it('should render grouped table when ungroupedHistoryViewEnabled query param is false', async () => {
    await setup({
      pageQueryParamsValues: {
        ungroupedHistoryViewEnabled: false,
      },
    });
    expect(
      await screen.findByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render ungrouped table when user preference is true and query param is not set', async () => {
    await setup({ ungroupedViewPreference: true });
    expect(await screen.findByText('WIP: ungrouped table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('workflow-history-grouped-table')
    ).not.toBeInTheDocument();
  });

  it('should show ungrouped table when query param overrides preference', async () => {
    await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: true },
      ungroupedViewPreference: false,
    });

    // Should show ungrouped table even though preference is false
    expect(await screen.findByText('WIP: ungrouped table')).toBeInTheDocument();
  });

  it('should use user preference when query param is undefined for ungrouped view', async () => {
    await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: undefined },
      ungroupedViewPreference: true,
    });

    // Should use preference (true) when query param is undefined
    expect(await screen.findByText('WIP: ungrouped table')).toBeInTheDocument();
  });

  it('should call setUngroupedViewUserPreference and setQueryParams when toggle is clicked from grouped to ungrouped', async () => {
    const { user, mockSetUngroupedViewUserPreference, mockSetQueryParams } =
      await setup({
        pageQueryParamsValues: {
          ungroupedHistoryViewEnabled: false,
        },
      });

    const toggleButton = screen.getByTestId('toggle-group-mode');
    await user.click(toggleButton);

    expect(mockSetUngroupedViewUserPreference).toHaveBeenCalledWith(true);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ungroupedHistoryViewEnabled: 'true',
    });
  });

  it('should call setUngroupedViewUserPreference and setQueryParams when toggle is clicked from ungrouped to grouped', async () => {
    const { user, mockSetUngroupedViewUserPreference, mockSetQueryParams } =
      await setup({
        pageQueryParamsValues: {
          ungroupedHistoryViewEnabled: true,
        },
      });

    const toggleButton = screen.getByTestId('toggle-group-mode');
    await user.click(toggleButton);

    expect(mockSetUngroupedViewUserPreference).toHaveBeenCalledWith(false);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ungroupedHistoryViewEnabled: 'false',
    });
  });

  it('should calculate activeFiltersCount as 0 when both filter arrays are empty', async () => {
    await setup({
      pageQueryParamsValues: {
        historyEventStatuses: [],
        historyEventTypes: [],
      },
    });

    const activeFiltersCountElement = await screen.findByTestId(
      'active-filters-count'
    );
    expect(activeFiltersCountElement).toHaveTextContent('0');
  });

  it('should calculate activeFiltersCount as 0 when both filter arrays are undefined', async () => {
    await setup({
      pageQueryParamsValues: {
        historyEventStatuses: undefined,
        historyEventTypes: undefined,
      },
    });

    const activeFiltersCountElement = await screen.findByTestId(
      'active-filters-count'
    );
    expect(activeFiltersCountElement).toHaveTextContent('0');
  });

  it('should calculate activeFiltersCount as sum of both filter arrays', async () => {
    await setup({
      pageQueryParamsValues: {
        historyEventStatuses: ['COMPLETED', 'FAILED'],
        historyEventTypes: ['DECISION', 'ACTIVITY', 'SIGNAL'],
      },
    });

    const activeFiltersCountElement = await screen.findByTestId(
      'active-filters-count'
    );
    expect(activeFiltersCountElement).toHaveTextContent('5');
  });
});

async function setup({
  error,
  summaryError,
  resolveLoadMoreManually,
  pageQueryParamsValues = {},
  hasNextPage,
  ungroupedViewPreference,
}: {
  error?: boolean;
  summaryError?: boolean;
  resolveLoadMoreManually?: boolean;
  pageQueryParamsValues?: Partial<
    PageQueryParamValues<typeof workflowPageQueryParamsConfig>
  >;
  hasNextPage?: boolean;
  ungroupedViewPreference?: boolean | null;
}) {
  const user = userEvent.setup();

  const mockSetQueryParams = jest.fn();
  jest.spyOn(usePageFiltersModule, 'default').mockReturnValue({
    queryParams: pageQueryParamsValues,
    setQueryParams: mockSetQueryParams,
    activeFiltersCount: 0,
    resetAllFilters: mockResetAllFilters,
  });

  const mockSetUngroupedViewUserPreference = jest.fn();

  type ReqResolver = (r: GetWorkflowHistoryResponse) => void;
  let requestResolver: ReqResolver = () => {};
  let requestRejector = () => {};
  const getRequestResolver = () => requestResolver;
  const getRequestRejector = () => requestRejector;
  let requestIndex = -1;

  const renderResult = render(
    <Suspense fallback={'Suspense placeholder'}>
      <WorkflowHistoryContext.Provider
        value={{
          ungroupedViewUserPreference: ungroupedViewPreference ?? null,
          setUngroupedViewUserPreference: mockSetUngroupedViewUserPreference,
        }}
      >
        <WorkflowHistoryV2
          params={{
            domain: 'test-domain',
            cluster: 'test-cluster',
            runId: 'test-runid',
            workflowId: 'test-workflowId',
            workflowTab: 'history',
          }}
        />
      </WorkflowHistoryContext.Provider>
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            requestIndex = requestIndex + 1;

            if (requestIndex > 0 && resolveLoadMoreManually) {
              return await new Promise((resolve, reject) => {
                requestResolver = (result: GetWorkflowHistoryResponse) =>
                  resolve(HttpResponse.json(result, { status: 200 }));

                requestRejector = () =>
                  reject(
                    HttpResponse.json(
                      { message: 'Failed to fetch workflow history' },
                      { status: 500 }
                    )
                  );
              });
            } else {
              if (error) {
                return HttpResponse.json(
                  { message: 'Failed to fetch workflow history' },
                  { status: 500 }
                );
              }

              const events: Array<HistoryEvent> = completedActivityTaskEvents;

              return HttpResponse.json(
                {
                  history: {
                    events,
                  },
                  archived: false,
                  nextPageToken: hasNextPage ? 'mock-next-page-token' : '',
                  rawHistory: [],
                } satisfies GetWorkflowHistoryResponse,
                { status: 200 }
              );
            }
          },
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          ...(summaryError
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch workflow summary' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: mockDescribeWorkflowResponse,
              }),
        },
      ],
    },
    {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 300, itemHeight: 100 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    }
  );
  if (!error && !summaryError)
    await waitForElementToBeRemoved(() =>
      screen.queryAllByText('Suspense placeholder')
    );

  return {
    user,
    getRequestResolver,
    getRequestRejector,
    ...renderResult,
    mockSetQueryParams,
    mockSetUngroupedViewUserPreference,
  };
}
