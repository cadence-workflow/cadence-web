import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type Props as PanelSectionProps } from '@/components/panel-section/panel-section.types';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { RequestError } from '@/utils/request/request-error';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import ScheduleRuns from '../schedule-runs';
import { type Props as ScheduleRunsTableProps } from '../schedule-runs-table/schedule-runs-table.types';

const mockRefetch = jest.fn();
const mockUseConfigValue = jest.mocked(useConfigValue);
const mockUsePageQueryParams = jest.mocked(usePageQueryParams);
const mockUseListWorkflows = jest.mocked(useListWorkflows);

jest.mock('@/hooks/use-config-value/use-config-value');
jest.mock('@/hooks/use-page-query-params/use-page-query-params');
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
jest.mock('../schedule-runs-table/schedule-runs-table', () =>
  jest.fn(({ workflows, isFetchingNextPage }: ScheduleRunsTableProps) => (
    <div>
      {workflows.length
        ? workflows.map(({ workflowID }) => workflowID).join(',')
        : 'No results'}
      {isFetchingNextPage && ' Background loading'}
    </div>
  ))
);
jest.mock('../schedule-runs-header', () =>
  jest.fn(() => <div>Search schedule runs</div>)
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

  it.each([
    [false, '='],
    [true, 'LIKE'],
  ])(
    'searches IDs with partial matching set to %s',
    (partialMatching, comparator) => {
      const search = String.raw`term"\value`;
      setup({ search, partialMatching });

      expect(mockUseListWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          query:
            `CadenceScheduleID = "test-schedule" AND ` +
            `(RunID ${comparator} "term\\"\\\\value" OR ` +
            `WorkflowID ${comparator} "term\\"\\\\value" OR ` +
            `CadenceScheduleBackfillID ${comparator} "term\\"\\\\value")`,
        })
      );
    }
  );

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

  it('renders no results and retains rows while refetching', () => {
    const { rerender } = setup({
      search: 'missing',
      hookResult: { workflows: [] },
    });
    expect(screen.getByText('No results')).toBeInTheDocument();

    mockUseListWorkflows.mockReturnValueOnce(
      getHookResult({ isFetching: true })
    );
    rerender(
      <ScheduleRuns
        params={{
          domain: 'test-domain',
          cluster: 'test-cluster',
          scheduleId: 'test-schedule',
          scheduleTab: 'runs',
        }}
      />
    );
    expect(screen.getByText(/first-page-workflow/)).toHaveTextContent(
      'Background loading'
    );
  });
});

type HookResult = ReturnType<typeof useListWorkflows>;

function setup({
  scheduleId = 'test-schedule',
  search = '',
  partialMatching = false,
  hookResult = {},
}: {
  scheduleId?: string;
  search?: string;
  partialMatching?: boolean;
  hookResult?: Partial<HookResult>;
} = {}) {
  mockUseConfigValue.mockReturnValue({
    data: partialMatching,
  } as ReturnType<typeof useConfigValue>);
  mockUsePageQueryParams.mockReturnValue([
    { scheduleRunsSearch: search },
    jest.fn(),
  ]);
  mockUseListWorkflows.mockReturnValue(getHookResult(hookResult));

  return render(
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

function getHookResult(overrides: Partial<HookResult> = {}): HookResult {
  const workflows = [
    getMockWorkflowListItem({ workflowID: 'first-page-workflow' }),
    getMockWorkflowListItem({ workflowID: 'second-page-workflow' }),
  ];
  return {
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
    isFetching: false,
    ...overrides,
  } as unknown as HookResult;
}
