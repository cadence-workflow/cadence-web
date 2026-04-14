import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import { mockWorkflowsListColumns } from '../__fixtures__/mock-workflows-list-columns';
import WorkflowsList from '../workflows-list';

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () =>
    jest.fn((props: LoaderProps) => (
      <div data-testid="mock-loader">
        {props.error ? 'Error' : 'OK'}
        {props.hasNextPage ? ' | has-next' : ' | no-next'}
        {props.isFetchingNextPage ? ' | fetching' : ' | idle'}
        {props.hasData ? ' | has-data' : ' | no-data'}
      </div>
    ))
);

const MOCK_WORKFLOWS = [
  getMockWorkflowListItem({
    workflowID: 'wf-1',
    runID: 'run-1',
  }),
  getMockWorkflowListItem({
    workflowID: 'wf-2',
    runID: 'run-2',
  }),
];

describe(WorkflowsList.name, () => {
  it('renders column headers', () => {
    setup({});

    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders workflow rows when not loading and workflows exist', () => {
    setup({});

    expect(screen.getByText('wf-1')).toBeInTheDocument();
    expect(screen.getByText('wf-2')).toBeInTheDocument();
  });

  it('does not render workflow rows when workflows array is empty', () => {
    setup({ workflows: [] });

    expect(screen.queryByText('wf-1')).not.toBeInTheDocument();
  });

  it('renders each row as a link with the correct href', () => {
    setup({});

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/workflows/wf-1/run-1');
    expect(links[1]).toHaveAttribute('href', '/workflows/wf-2/run-2');
  });

  it('encodes workflow and run IDs in the link href', () => {
    setup({
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf/special id',
          runID: 'run/special id',
        }),
      ],
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/workflows/wf%2Fspecial%20id/run%2Fspecial%20id'
    );
  });

  it('renders cell content for each column', () => {
    setup({});

    expect(screen.getByText('wf-1')).toBeInTheDocument();
    expect(screen.getByText('wf-2')).toBeInTheDocument();
    expect(
      screen.getAllByText('WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID')
    ).toHaveLength(2);
  });

  it('passes correct props to TableInfiniteScrollLoader', () => {
    setup({
      hasNextPage: true,
      isFetchingNextPage: true,
      error: new Error('test error'),
    });

    const loader = screen.getByTestId('mock-loader');
    expect(loader).toHaveTextContent('Error');
    expect(loader).toHaveTextContent('has-next');
    expect(loader).toHaveTextContent('fetching');
    expect(loader).toHaveTextContent('has-data');
  });

  it('renders "None" placeholder when a column renderCell returns null', () => {
    setup({
      workflows: [MOCK_WORKFLOWS[0]],
      columns: [
        {
          id: 'NullableCol',
          name: 'Nullable Column',
          width: '100px',
          isSystem: false,
          renderCell: () => null,
        },
      ],
    });

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('passes hasData as false to loader when workflows is empty', () => {
    setup({ workflows: [] });

    const loader = screen.getByTestId('mock-loader');
    expect(loader).toHaveTextContent('no-data');
  });

  it('renders plain header cells when sortParams is not provided', () => {
    setup({
      columns: [
        {
          id: 'StartTime',
          name: 'Started',
          width: '200px',
          isSystem: true,
          sortable: true,
          renderCell: () => 'start',
        },
      ],
    });

    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders sortable header cells as buttons when sortParams is provided', () => {
    const onSort = jest.fn();
    setup({
      columns: [
        {
          id: 'StartTime',
          name: 'Started',
          width: '200px',
          isSystem: true,
          sortable: true,
          renderCell: () => 'start',
        },
      ],
      sortParams: {
        onSort,
        sortColumn: '',
        sortOrder: 'DESC',
      },
    });

    const button = screen.getByRole('button', {
      name: /Started/,
    });
    expect(button).toBeInTheDocument();
  });

  it('calls onSort with the column id when a sortable header is clicked', async () => {
    const onSort = jest.fn();
    const { user } = setup({
      columns: [
        {
          id: 'StartTime',
          name: 'Started',
          width: '200px',
          isSystem: true,
          sortable: true,
          renderCell: () => 'start',
        },
      ],
      sortParams: {
        onSort,
        sortColumn: '',
        sortOrder: 'DESC',
      },
    });

    await user.click(
      screen.getByRole('button', {
        name: /Started/,
      })
    );
    expect(onSort).toHaveBeenCalledWith('StartTime');
  });

  it('does not render non-sortable columns as buttons even when sortParams is provided', () => {
    setup({
      columns: [
        {
          id: 'WorkflowID',
          name: 'Workflow ID',
          width: '200px',
          isSystem: true,
          renderCell: (row) => row.workflowID,
        },
      ],
      sortParams: {
        onSort: jest.fn(),
        sortColumn: '',
        sortOrder: 'DESC',
      },
    });

    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

function setup({
  workflows = MOCK_WORKFLOWS,
  columns = mockWorkflowsListColumns,
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
  sortParams,
}: Partial<React.ComponentProps<typeof WorkflowsList>> = {}) {
  const user = userEvent.setup();
  render(
    <WorkflowsList
      workflows={workflows}
      columns={columns}
      error={error}
      hasNextPage={hasNextPage}
      fetchNextPage={jest.fn()}
      isFetchingNextPage={isFetchingNextPage}
      sortParams={sortParams}
    />
  );
  return { user };
}
