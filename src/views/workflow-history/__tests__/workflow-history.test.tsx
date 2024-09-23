import { Suspense } from 'react';

import { HttpResponse } from 'msw';
import { VirtuosoMockContext } from 'react-virtuoso';

import { act, render, screen } from '@/test-utils/rtl';

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
});

function setup({ error }: { error?: boolean }) {
  render(
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
}
