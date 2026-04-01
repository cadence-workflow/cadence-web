import React from 'react';

import { render, screen } from '@/test-utils/rtl';

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

  it('does not render workflow rows when loading', () => {
    setup({ isLoading: true });

    expect(screen.queryByText('wf-1')).not.toBeInTheDocument();
    expect(screen.queryByText('wf-2')).not.toBeInTheDocument();
  });

  it('does not render workflow rows when workflows array is empty', () => {
    setup({ workflows: [] });

    expect(screen.queryByText('wf-1')).not.toBeInTheDocument();
  });

  it('still renders column headers when loading', () => {
    setup({ isLoading: true });

    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
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

  it('passes hasData as false to loader when workflows is empty', () => {
    setup({ workflows: [] });

    const loader = screen.getByTestId('mock-loader');
    expect(loader).toHaveTextContent('no-data');
  });
});

function setup({
  workflows = MOCK_WORKFLOWS,
  columns = mockWorkflowsListColumns,
  isLoading = false,
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
}: Partial<React.ComponentProps<typeof WorkflowsList>> = {}) {
  render(
    <WorkflowsList
      workflows={workflows}
      columns={columns}
      isLoading={isLoading}
      error={error}
      hasNextPage={hasNextPage}
      fetchNextPage={jest.fn()}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
