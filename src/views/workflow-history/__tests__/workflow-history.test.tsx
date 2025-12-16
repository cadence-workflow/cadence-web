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

import { completedActivityTaskEvents } from '../__fixtures__/workflow-history-activity-events';
import { completedDecisionTaskEvents } from '../__fixtures__/workflow-history-decision-events';
import WorkflowHistory from '../workflow-history';
import { WorkflowHistoryContext } from '../workflow-history-context-provider/workflow-history-context-provider';

jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [{ historySelectedEventId: '1' }, jest.fn()])
);

// Mock the hook to use minimal throttle delay for faster tests
jest.mock('../hooks/use-workflow-history-fetcher', () => {
  const actual = jest.requireActual('../hooks/use-workflow-history-fetcher');
  return {
    __esModule: true,
    default: jest.fn((params, onEventsChange) =>
      actual.default(params, onEventsChange, 0)
    ), // 0ms throttle for tests
  };
});

jest.mock(
  '../workflow-history-compact-event-card/workflow-history-compact-event-card',
  () => jest.fn(() => <div>Compact group Card</div>)
);

jest.mock(
  '../workflow-history-timeline-group/workflow-history-timeline-group',
  () =>
    jest.fn(({ onReset, resetToDecisionEventId }) => (
      <div>
        Timeline group card
        {resetToDecisionEventId && <button onClick={onReset}>Reset</button>}
      </div>
    ))
);

jest.mock(
  '../workflow-history-timeline-load-more/workflow-history-timeline-load-more',
  () => jest.fn(() => <div>Load more</div>)
);

jest.mock('@/components/page-filters/hooks/use-page-filters', () =>
  jest.fn().mockReturnValue({})
);

jest.mock('../config/workflow-history-filters.config', () => []);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>keep loading events</div>)
);

jest.mock('../workflow-history-header/workflow-history-header', () =>
  jest.fn(() => (
    <div>
      <div>Workflow history Header</div>
    </div>
  ))
);

jest.mock(
  '../workflow-history-ungrouped-table/workflow-history-ungrouped-table',
  () => jest.fn(() => <div>Ungrouped Table</div>)
);

jest.mock(
  '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal',
  () =>
    jest.fn(({ onClose }) => (
      <div>
        <div>Workflow Actions</div>
        <button onClick={onClose}>Close</button>
      </div>
    ))
);

describe('WorkflowHistory', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders page header correctly', async () => {
    await setup({});
    expect(
      await screen.findByText('Workflow history Header')
    ).toBeInTheDocument();
  });

  it('renders compact group cards', async () => {
    await setup({});
    expect(await screen.findByText('Compact group Card')).toBeInTheDocument();
  });

  it('renders timeline group cards', async () => {
    await setup({});
    expect(await screen.findByText('Timeline group card')).toBeInTheDocument();
  });

  it('renders load more section', async () => {
    await setup({});
    expect(await screen.findByText('Load more')).toBeInTheDocument();
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

  it('should show no results when filtered events are empty and no next page', async () => {
    await setup({ emptyEvents: true, hasNextPage: false });
    expect(await screen.findByText('No Results')).toBeInTheDocument();
  });

  it('should not show no results when filtered events are empty but has next page', async () => {
    await setup({
      emptyEvents: true,
      hasNextPage: true,
    });

    // Should not show "No Results" when there's a next page
    expect(screen.queryByText('No Results')).not.toBeInTheDocument();

    // Should show the load more footer component instead
    expect(screen.getByText('Load more')).toBeInTheDocument();
  });

  it('should not show no results when there are filtered events', async () => {
    await setup({});
    await waitFor(() => {
      expect(screen.queryByText('No Results')).not.toBeInTheDocument();
    });
  });

  it('should show ungrouped table when ungrouped view is enabled', async () => {
    setup({ pageQueryParamsValues: { ungroupedHistoryViewEnabled: true } });
    expect(await screen.findByText('Ungrouped Table')).toBeInTheDocument();
  });

  it('should show workflow actions modal when resetToDecisionEventId is set', async () => {
    const { user } = await setup({ withResetModal: true });

    const resetButton = await screen.findByText('Reset');
    await user.click(resetButton);

    expect(screen.getByText('Workflow Actions')).toBeInTheDocument();
  });

  it('should show ungrouped table when query param overrides preference', async () => {
    await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: true },
      ungroupedViewPreference: false,
    });

    // Should show ungrouped table even though preference is false
    expect(await screen.findByText('Ungrouped Table')).toBeInTheDocument();
  });

  it('should use user preference when query param is undefined for ungrouped view', async () => {
    await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: undefined },
      ungroupedViewPreference: true,
    });

    // Should use preference (true) when query param is undefined
    expect(await screen.findByText('Ungrouped Table')).toBeInTheDocument();
  });
});

async function setup({
  error,
  summaryError,
  resolveLoadMoreManually,
  pageQueryParamsValues = {},
  hasNextPage,
  emptyEvents,
  withResetModal,
  ungroupedViewPreference,
}: {
  error?: boolean;
  summaryError?: boolean;
  resolveLoadMoreManually?: boolean;
  pageQueryParamsValues?: Partial<
    PageQueryParamValues<typeof workflowPageQueryParamsConfig>
  >;
  hasNextPage?: boolean;
  emptyEvents?: boolean;
  withResetModal?: boolean;
  ungroupedViewPreference?: boolean;
}) {
  const user = userEvent.setup();

  const mockSetQueryParams = jest.fn();
  if (pageQueryParamsValues) {
    jest.spyOn(usePageFiltersModule, 'default').mockReturnValue({
      queryParams: pageQueryParamsValues,
      setQueryParams: mockSetQueryParams,
      activeFiltersCount: 0,
      resetAllFilters: jest.fn(),
    });
  }

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
        <WorkflowHistory
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

              let events: Array<HistoryEvent> = completedActivityTaskEvents;
              if (emptyEvents) {
                events = [];
              } else if (withResetModal) {
                events = completedDecisionTaskEvents;
              }

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
