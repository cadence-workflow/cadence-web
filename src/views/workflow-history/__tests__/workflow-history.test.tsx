import { Suspense } from 'react';

import { HttpResponse } from 'msw';
import { VirtuosoMockContext } from 'react-virtuoso';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as PageFiltersToggleProps } from '@/components/page-filters/page-filters-toggle/page-filters-toggle.types';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

import { completedActivityTaskEvents } from '../__fixtures__/workflow-history-activity-events';
import WorkflowHistory from '../workflow-history';

jest.mock(
  '../workflow-history-compact-event-card/workflow-history-compact-event-card',
  () => jest.fn(() => <div>Compact group Card</div>)
);

jest.mock(
  '../workflow-history-timeline-group/workflow-history-timeline-group',
  () => jest.fn(() => <div>Timeline group card</div>)
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
      await act(() => setup({ error: true }));
    } catch (error) {
      expect((error as Error)?.message).toBe(
        'Failed to fetch workflow history'
      );
    }
  });

  it('should render the page initially with filters shown', async () => {
    setup({});
    expect(await screen.findByText('Filter Fields')).toBeInTheDocument();
  });

  it('should hide filters on executing toggle button onClick', async () => {
    const { user } = setup({});
    const toggleButton = await screen.findByText('Filter Toggle');

    await user.click(toggleButton);

    expect(screen.queryByText('Filter Fields')).not.toBeInTheDocument();
  });
});

function setup({ error }: { error?: boolean }) {
  const user = userEvent.setup();
  const renderResult = render(
    <Suspense>
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
          ...(error
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch workflow history' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  history: {
                    events: completedActivityTaskEvents,
                  },
                  archived: false,
                  nextPageToken: '',
                  rawHistory: [],
                } satisfies GetWorkflowHistoryResponse,
              }),
        },
      ],
    },
    {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 100 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    }
  );

  return { user, ...renderResult };
}
