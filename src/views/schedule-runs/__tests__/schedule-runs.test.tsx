import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type Props as PanelSectionProps } from '@/components/panel-section/panel-section.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { RequestError } from '@/utils/request/request-error';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import ScheduleRuns from '../schedule-runs';
import { type Props as ScheduleRunsTableProps } from '../schedule-runs-table.types';

const mockRefetch = jest.fn();
const mockUseListWorkflows = jest.mocked(useListWorkflows);

jest.mock('@/views/shared/hooks/use-list-workflows');
jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>Loading schedule runs</div>)
);
jest.mock('@/components/panel-section/panel-section', () =>
  jest.fn(({ children }: PanelSectionProps) => <section>{children}</section>)
);
jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, reset }: ErrorPanelProps) => (
    <div>
      {message}
      {reset && <button onClick={reset}>Retry</button>}
    </div>
  ))
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
    setup({ hookResult: { data: undefined, isLoading: true } });

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
      screen.getByText('Failed to load schedule runs')
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

type HookResult = ReturnType<typeof useListWorkflows>;

function setup({
  scheduleId = 'test-schedule',
  hookResult = {},
}: {
  scheduleId?: string;
  hookResult?: Partial<HookResult>;
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
    />
  );
}
