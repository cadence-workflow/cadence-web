import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import type { Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import CronListTable from '../cron-list-table';

const WORKFLOWS_PER_PAGE = 20;

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div data-testid="loading-indicator">Loading...</div>)
);

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () =>
    jest.fn((props: LoaderProps) => (
      <button data-testid="mock-loader" onClick={props.fetchNextPage}>
        Mock end message: {props.error ? 'Error' : 'OK'}
      </button>
    ))
);

describe('CronListTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator', async () => {
    setup({ isLoading: true });

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.queryByText('Workflow ID')).not.toBeInTheDocument();
  });

  it('renders workflows', async () => {
    const { user } = setup();

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    Array(WORKFLOWS_PER_PAGE).forEach((_, index) => {
      const pageIndex = 0;
      expect(
        screen.getByText(`mock-workflow-id-${pageIndex}-${index}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    Array(WORKFLOWS_PER_PAGE).forEach((_, index) => {
      const pageIndex = 1;
      expect(
        screen.getByText(`mock-workflow-id-${pageIndex}-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('renders empty table', async () => {
    setup({ errorCase: 'no-workflows' });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.queryByText('mock-workflow-id')).not.toBeInTheDocument();
  });

  it('should allow the user to try again if there is an error', async () => {
    const { user } = setup({ errorCase: 'subsequent-fetch-error' });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(
      await screen.findByText('Mock end message: Error')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    Array(WORKFLOWS_PER_PAGE).forEach((_, index) => {
      const pageIndex = 1;
      expect(
        screen.getByText(`mock-workflow-id-${pageIndex}-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('renders error state when initial fetch fails', async () => {
    setup({ errorCase: 'initial-fetch-error' });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    expect(
      await screen.findByText('Mock end message: Error')
    ).toBeInTheDocument();
  });
});

function setup(opts?: {
  errorCase?: 'initial-fetch-error' | 'subsequent-fetch-error' | 'no-workflows';
  isLoading?: boolean;
}) {
  const { errorCase, isLoading } = opts ?? {};
  const pages = generateWorkflowPages(2);
  let currentEventIndex = 0;
  const user = userEvent.setup();

  const endpointsMocks = [
    {
      path: '/api/domains/:domain/:cluster/workflows',
      httpMethod: 'GET',
      mockOnce: false,
      httpResolver: async () => {
        if (isLoading) {
          // Return a promise that never resolves to simulate loading
          return new Promise(() => {});
        }

        const index = currentEventIndex;
        currentEventIndex++;

        switch (errorCase) {
          case 'no-workflows':
            return HttpResponse.json({
              workflows: [],
              nextPage: undefined,
            });
          case 'initial-fetch-error':
            return HttpResponse.json(
              { message: 'Request failed' },
              { status: 500 }
            );
          case 'subsequent-fetch-error':
            if (index === 0) {
              return HttpResponse.json(pages[0]);
            } else if (index === 1) {
              return HttpResponse.json(
                { message: 'Request failed' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(pages[1]);
            }
          default:
            if (index === 0) {
              return HttpResponse.json(pages[0]);
            } else {
              return HttpResponse.json(pages[1]);
            }
        }
      },
    },
  ] as MSWMocksHandlersProps['endpointsMocks'];

  render(<CronListTable domain="mock-domain" cluster="mock-cluster" />, {
    endpointsMocks,
  });

  return { user };
}

function generateWorkflowPages(count: number): Array<ListWorkflowsResponse> {
  const pages = Array.from(
    { length: count },
    (_, pageIndex): ListWorkflowsResponse => ({
      workflows: Array.from({ length: WORKFLOWS_PER_PAGE }, (_, index) => ({
        workflowID: `mock-workflow-id-${pageIndex}-${index}`,
        runID: `mock-run-id-${pageIndex}-${index}`,
        workflowName: `mock-workflow-name-${pageIndex}-${index}`,
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
        startTime: 1763498300000,
        closeTime: undefined, // Cron List excludes closed workflows.
      })),
      nextPage: `${pageIndex + 1}`,
    })
  );

  pages[pages.length - 1].nextPage = '';
  return pages;
}
