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
import { type Props as PageFiltersToggleProps } from '@/components/page-filters/page-filters-toggle/page-filters-toggle.types';
import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';
import type workflowPageQueryParamsConfig from '@/views/workflow-page/config/workflow-page-query-params.config';

import { completedActivityTaskEvents } from '../__fixtures__/workflow-history-activity-events';
import { completedDecisionTaskEvents } from '../__fixtures__/workflow-history-decision-events';
import WorkflowHistory from '../workflow-history';

jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [{ historySelectedEventId: '1' }, jest.fn()])
);

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
  '../workflow-history-timeline-chart/workflow-history-timeline-chart',
  () => jest.fn(() => <div>Timeline chart</div>)
);

jest.mock(
  '../workflow-history-timeline-load-more/workflow-history-timeline-load-more',
  () => jest.fn(() => <div>Load more</div>)
);

jest.mock(
  '@/components/page-filters/page-filters-toggle/page-filters-toggle',
  () =>
    jest.fn((props: PageFiltersToggleProps) => (
      <button onClick={props.onClick}>Filter Toggle</button>
    ))
);

jest.mock(
  '@/components/page-filters/page-filters-fields/page-filters-fields',
  () => jest.fn(() => <div>Filter Fields</div>)
);

jest.mock('@/components/page-filters/hooks/use-page-filters', () =>
  jest.fn().mockReturnValue({})
);

jest.mock('../config/workflow-history-filters.config', () => []);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>keep loading events</div>)
);

jest.mock(
  '../workflow-history-expand-all-events-button/workflow-history-expand-all-events-button',
  () =>
    jest.fn(({ isExpandAllEvents, toggleIsExpandAllEvents }) => (
      <button onClick={toggleIsExpandAllEvents}>
        {isExpandAllEvents ? 'Collapse All' : 'Expand All'}
      </button>
    ))
);

jest.mock(
  '../workflow-history-export-json-button/workflow-history-export-json-button',
  () => jest.fn(() => <button>Export JSON</button>)
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
  it('renders page correctly', async () => {
    setup({});
    expect(await screen.findByText('Workflow history')).toBeInTheDocument();
  });

  it('renders compact group cards', async () => {
    setup({});
    expect(await screen.findByText('Compact group Card')).toBeInTheDocument();
  });

  it('renders timeline group cards', async () => {
    setup({});
    expect(await screen.findByText('Timeline group card')).toBeInTheDocument();
  });

  it('renders load more section', async () => {
    setup({});
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

  it('should render the page initially with filters shown', async () => {
    setup({});
    expect(await screen.findByText('Filter Fields')).toBeInTheDocument();
  });

  it('should hide filters on executing toggle button onClick', async () => {
    const { user } = await setup({});
    const toggleButton = await screen.findByText('Filter Toggle');

    await user.click(toggleButton);

    expect(screen.queryByText('Filter Fields')).not.toBeInTheDocument();
  });

  it('should show timeline when the Timeline button is clicked', async () => {
    const { user } = await setup({});
    const timelineButton = await screen.findByText('Timeline');

    await user.click(timelineButton);

    expect(screen.queryByText('Timeline chart')).toBeInTheDocument();
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

  it('should show no results when filtered events are empty', async () => {
    setup({ emptyEvents: true });
    expect(await screen.findByText('No Results')).toBeInTheDocument();
  });

  it('should render expand all events button', async () => {
    setup({});
    expect(await screen.findByText('Expand All')).toBeInTheDocument();
  });

  it('should render export JSON button', async () => {
    setup({});
    expect(await screen.findByText('Export JSON')).toBeInTheDocument();
  });

  it('should show "Ungroup" button in grouped view and call setQueryParams when clicked', async () => {
    const { user, mockSetQueryParams } = await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: false },
    });

    const ungroupButton = await screen.findByText('Ungroup');
    expect(ungroupButton).toBeInTheDocument();

    await user.click(ungroupButton);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ungroupedHistoryViewEnabled: 'true',
    });
  });

  it('should show "Group" button when in ungrouped view', async () => {
    await setup({
      pageQueryParamsValues: { ungroupedHistoryViewEnabled: true },
    });

    expect(await screen.findByText('Group')).toBeInTheDocument();
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
});

async function setup({
  error,
  summaryError,
  resolveLoadMoreManually,
  pageQueryParamsValues = {},
  hasNextPage,
  emptyEvents,
  withResetModal,
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

  type ReqResolver = (r: GetWorkflowHistoryResponse) => void;
  let requestResolver: ReqResolver = () => {};
  let requestRejector = () => {};
  const getRequestResolver = () => requestResolver;
  const getRequestRejector = () => requestRejector;
  let requestIndex = -1;

  const renderResult = render(
    <Suspense fallback={'Suspense placeholder'}>
      <WorkflowHistory
        params={{
          domain: 'test-domain',
          cluster: 'test-cluster',
          runId: 'test-runid',
          workflowId: 'test-workflowId',
          workflowTab: 'history',
        }}
      />
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
  };
}
