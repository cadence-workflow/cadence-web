import { render, screen, userEvent } from '@/test-utils/rtl';

import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type Props as PanelSectionProps } from '@/components/panel-section/panel-section.types';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { RequestError } from '@/utils/request/request-error';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import ScheduleRuns from '../schedule-runs';
import { type Props as ScheduleRunsTableProps } from '../schedule-runs-table.types';
import { type ScheduleRunsRunType } from '../schedule-runs.types';

const mockRefetch = jest.fn();
const mockUsePageQueryParams = jest.mocked(usePageQueryParams);
const mockUseListWorkflows = jest.mocked(useListWorkflows);

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
jest.mock('../schedule-runs-table', () =>
  jest.fn(({ workflows }: ScheduleRunsTableProps) => (
    <div>
      {workflows.length
        ? workflows.map(({ workflowID }) => workflowID).join(',')
        : 'No results'}
    </div>
  ))
);
jest.mock('../schedule-runs-header', () =>
  jest.fn(() => <div>Schedule run filters</div>)
);
describe(ScheduleRuns.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries the schedule and renders all loaded pages in the table', () => {
    const scheduleId = String.raw`schedule"\id`;
    setup({ scheduleId });

    expect(mockUseListWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining(
          String.raw`CadenceScheduleID = "schedule\"\\id"`
        ),
      })
    );
    expect(screen.getByText(/first-page-workflow/)).toBeInTheDocument();
    expect(screen.getByText(/second-page-workflow/)).toBeInTheDocument();
  });

  it('combines Schedule time and workflow status filters', () => {
    setup({
      timeStart: new Date('2026-07-12T10:00:00Z'),
      timeEnd: new Date('2026-07-19T10:00:00Z'),
      statuses: [
        'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      ],
    });

    expect(mockUseListWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        query:
          'CadenceScheduleID = "test-schedule" AND ' +
          '(CloseStatus = 1 OR CloseTime = missing) AND ' +
          'CadenceScheduleTime > "2026-07-12T10:00:00.000Z" AND ' +
          'CadenceScheduleTime <= "2026-07-19T10:00:00.000Z"',
      })
    );
  });

  it.each([
    ['backfill', 'true'],
    ['regular', 'false'],
  ] as const)('queries %s runs', (runType, expectedValue) => {
    setup({ runType });
    expect(mockUseListWorkflows).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining(
          `CadenceScheduleIsBackfill = ${expectedValue}`
        ),
      })
    );
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

  it('renders no results for an empty filtered response', () => {
    setup({
      timeStart: new Date('2026-07-12T10:00:00Z'),
      hookResult: { workflows: [] },
    });
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

type HookResult = ReturnType<typeof useListWorkflows>;

function setup({
  scheduleId = 'test-schedule',
  timeStart,
  timeEnd,
  statuses,
  runType = 'all',
  hookResult = {},
}: {
  scheduleId?: string;
  timeStart?: DateFilterValue;
  timeEnd?: DateFilterValue;
  statuses?: Array<WorkflowStatus>;
  runType?: ScheduleRunsRunType;
  hookResult?: Partial<HookResult>;
} = {}) {
  mockUsePageQueryParams.mockReturnValue([
    {
      scheduleRunsTimeStart: timeStart,
      scheduleRunsTimeEnd: timeEnd,
      scheduleRunsStatuses: statuses,
      scheduleRunsRunType: runType,
    },
    jest.fn(),
  ]);
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
    isFetching: false,
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
