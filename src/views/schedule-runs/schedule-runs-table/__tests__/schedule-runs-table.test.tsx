import { render, screen } from '@/test-utils/rtl';

import Table from '@/components/table/table';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import ScheduleRunsTable from '../schedule-runs-table';
import scheduleRunsTableConfig from '../../config/schedule-runs-table.config';
import { type Props } from '../schedule-runs-table.types';

jest.mock('@/components/table/table', () =>
  jest.fn(() => <div>Mock Table</div>)
);

const mockTable = jest.mocked(Table);

describe(ScheduleRunsTable.name, () => {
  it('renders the table', () => {
    setup();

    expect(screen.getByText('Mock Table')).toBeInTheDocument();
  });

  it('passes enriched rows to Table', () => {
    const { props } = setup();

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            ...props.workflows[0],
            domain: props.domain,
            cluster: props.cluster,
          },
        ],
        columns: scheduleRunsTableConfig,
        shouldShowResults: true,
      }),
      {}
    );
  });

  it('passes empty state to Table', () => {
    setup({ workflows: [] });

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [],
        shouldShowResults: false,
        endMessageProps: expect.objectContaining({ hasData: false }),
      }),
      {}
    );
  });

  it('passes pagination props to Table', () => {
    const error = new Error('Request failed');
    const { fetchNextPage } = setup({ error, isFetchingNextPage: true });

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        endMessageProps: {
          kind: 'infinite-scroll',
          hasData: true,
          error,
          fetchNextPage,
          hasNextPage: true,
          isFetchingNextPage: true,
        },
      }),
      {}
    );
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
      }),
    ],
    error: null,
    hasNextPage: true,
    fetchNextPage,
    isFetchingNextPage: false,
    ...overrides,
  };
  render(<ScheduleRunsTable {...props} />);
  return { props, fetchNextPage };
}
