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

import * as usePageFiltersModule from '@/components/page-filters/hooks/use-page-filters';
import { type Props as PageFiltersToggleProps } from '@/components/page-filters/page-filters-toggle/page-filters-toggle.types';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { describeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

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
  () => jest.fn(() => <div>Timeline group card</div>)
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

    const loadingIndicator = await screen.findByText('keep loading events');
    expect(loadingIndicator).toBeInTheDocument();

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
});

async function setup({
  error,
  summaryError,
  resolveLoadMoreManually,
  pageQueryParamsValues = {},
  hasNextPage,
}: {
  error?: boolean;
  summaryError?: boolean;
  resolveLoadMoreManually?: boolean;
  pageQueryParamsValues?: Record<string, string>;
  hasNextPage?: boolean;
}) {
  const user = userEvent.setup();

  if (pageQueryParamsValues) {
    jest.spyOn(usePageFiltersModule, 'default').mockReturnValue({
      queryParams: pageQueryParamsValues,
      setQueryParams: jest.fn(),
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
              if (error)
                return HttpResponse.json(
                  { message: 'Failed to fetch workflow history' },
                  { status: 500 }
                );

              return HttpResponse.json(
                {
                  history: {
                    events: completedActivityTaskEvents,
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
                jsonResponse: describeWorkflowResponse,
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

  return { user, getRequestResolver, getRequestRejector, ...renderResult };
}
