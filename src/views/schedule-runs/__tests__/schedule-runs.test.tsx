import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { type Props as MSWMocksHandlersProps } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import ScheduleRuns from '../schedule-runs';
import { type Props as ScheduleRunsTableProps } from '../schedule-runs-table.types';

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>Loading schedule runs</div>)
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: ErrorPanelProps) => <div>{message}</div>)
);
jest.mock('../schedule-runs-table', () =>
  jest.fn(({ workflows }: ScheduleRunsTableProps) => (
    <div>
      {workflows.length
        ? workflows.map(({ workflowID }) => workflowID).join(',')
        : 'No results'}
    </div>
  ))
);
describe(ScheduleRuns.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries the schedule and renders all loaded pages in the table', () => {
    const scheduleId = String.raw`schedule"\id`;
    setup({ scheduleId });

    expect(mockUseListWorkflows).toHaveBeenCalledWith({
      domain: 'test-domain',
      cluster: 'test-cluster',
      listType: 'default',
      pageSize: 20,
      inputType: 'query',
      query: String.raw`CadenceScheduleID = "schedule\"\\id"`,
    });
    expect(screen.getByText(/first-page-workflow/)).toBeInTheDocument();
    expect(screen.getByText(/second-page-workflow/)).toBeInTheDocument();
  });

  it('renders the initial loading state', () => {
    setup({ isLoading: true });

    expect(screen.getByText('Loading schedule runs')).toBeInTheDocument();
  });

  it('renders a retryable request error', async () => {
    const user = userEvent.setup();
    setup({
      hookResult: {
        data: undefined,
        workflows: [],
        error: new RequestError('Request failed', '/workflows', 500),
      },
    });

    expect(
      await screen.findByText('Failed to load schedule runs')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state when the first page has no runs', () => {
    setup({
      hookResult: {
        workflows: [],
      },
    });

    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

function setup({
  scheduleId = 'test-schedule',
  isError = false,
  isLoading = false,
}: {
  scheduleId?: string;
  isError?: boolean;
  isLoading?: boolean;
} = {}) {
  const workflows = [
    getMockWorkflowListItem({ workflowID: 'first-page-workflow' }),
    getMockWorkflowListItem({ workflowID: 'second-page-workflow' }),
  ];
  mockUseListWorkflows.mockReturnValue({
    data: {
      pages: [
        {
          workflows: [workflows[0]],
          nextPage: 'next-page',
        },
        {
          workflows: [workflows[1]],
          nextPage: '',
        },
      ],
      pageParams: [undefined, 'next-page'],
    },
    workflows,
    error: null,
    isLoading: false,
    refetch: mockRefetch,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
    ...hookResult,
  } as unknown as HookResult);

  render(
    <ScheduleRuns
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId,
        scheduleTab: 'runs',
      }}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (isLoading) {
              return new Promise(() => {});
            }

            if (isError) {
              return HttpResponse.json(
                { message: 'Request failed' },
                { status: 500 }
              );
            }

            return HttpResponse.json({
              workflows: [
                getMockWorkflowListItem({
                  workflowID: 'first-page-workflow',
                }),
              ],
              nextPage: 'next-page',
            } satisfies ListWorkflowsResponse);
          },
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user };
}
