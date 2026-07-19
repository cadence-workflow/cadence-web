import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as LinkProps } from '@/components/link/link.types';
import {
  type EndMessageProps,
  type TableConfig,
} from '@/components/table/table.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';

import ScheduleRunsTable from '../schedule-runs-table';
import { type Props } from '../schedule-runs-table.types';

type MockTableProps = {
  data: Array<WorkflowListItem>;
  columns: TableConfig<WorkflowListItem>;
  endMessageProps: Extract<EndMessageProps, { kind: 'infinite-scroll' }>;
};

jest.mock('@/components/link/link', () =>
  jest.fn(({ href, children }: LinkProps) => (
    <a href={href.toString()}>{children}</a>
  ))
);
jest.mock('@/components/table/table', () =>
  jest.fn(({ data, columns, endMessageProps }: MockTableProps) => (
    <table>
      <thead>
        <tr>
          {columns.map(({ id, name }) => (
            <th key={id}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.runID}>
            {columns.map((column) => (
              <td key={column.id}>
                <column.renderCell {...row} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <button onClick={endMessageProps.fetchNextPage}>
              {endMessageProps.isFetchingNextPage
                ? 'Loading more'
                : endMessageProps.error
                  ? 'Retry'
                  : endMessageProps.hasNextPage
                    ? 'Load more'
                    : 'End of results'}
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  ))
);

describe(ScheduleRunsTable.name, () => {
  it('renders the base columns and an encoded run link', () => {
    setup();

    expect(screen.getByRole('link', { name: 'run/id?' })).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster/workflows/workflow%2Fid/run%2Fid%3F'
    );
    ['2026-07-19T10:00:00Z', '100 → 200'].forEach((value) =>
      expect(screen.getByText(value)).toBeInTheDocument()
    );
  });

  it('loads the next page while retaining existing rows', async () => {
    const user = userEvent.setup();
    const { fetchNextPage } = setup();

    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    expect(screen.getByText('workflow/id')).toBeInTheDocument();
  });

  it('renders distinct loading, error, and end states', () => {
    const { rerender, props } = setup({ isFetchingNextPage: true });
    expect(screen.getByRole('button', { name: 'Loading more' })).toBeVisible();

    rerender(
      <ScheduleRunsTable
        {...props}
        isFetchingNextPage={false}
        error={new Error('Request failed')}
      />
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();

    rerender(
      <ScheduleRunsTable
        {...props}
        isFetchingNextPage={false}
        hasNextPage={false}
      />
    );
    expect(
      screen.getByRole('button', { name: 'End of results' })
    ).toBeVisible();
  });
});

function setup(overrides: Partial<Props> = {}) {
  const fetchNextPage = jest.fn();
  const props: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflows: [
      getMockWorkflowListItem({
        workflowID: 'workflow/id',
        runID: 'run/id?',
        startTime: 100,
        closeTime: 200,
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
        searchAttributes: {
          CadenceScheduleIsBackfill: { data: btoa('true') },
          CadenceScheduleTime: { data: btoa('"2026-07-19T10:00:00Z"') },
        },
      }),
    ],
    error: null,
    hasNextPage: true,
    fetchNextPage,
    isFetchingNextPage: false,
    ...overrides,
  };
  const renderResult = render(<ScheduleRunsTable {...props} />);
  return { ...renderResult, props, fetchNextPage };
}
