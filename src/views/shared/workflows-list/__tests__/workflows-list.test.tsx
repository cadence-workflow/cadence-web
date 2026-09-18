import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type PublicProviderProps } from '@/test-utils/rtl.types';

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

  it('renders each row link as non-draggable so drag-to-select works', () => {
    setup({});

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('draggable', 'false');
    }
  });

  // `event.defaultPrevented` is true after every click regardless of our fix
  // (next/link's own handler also calls preventDefault before navigating),
  // so it can't distinguish the two cases. `onPush` only fires when
  // next/link actually reaches its navigation step, which it skips whenever
  // our handler already prevented the default - so it's a reliable signal
  // for whether navigation was actually triggered.
  it('triggers navigation on a plain click with no text selected', async () => {
    const onPush = jest.fn();
    const { user } = setup({}, { router: { onPush } });

    await user.click(screen.getAllByRole('link')[0]);

    expect(onPush).toHaveBeenCalledTimes(1);
  });

  it('does not trigger navigation when dragging to select text on a row', async () => {
    const onPush = jest.fn();
    const { user } = setup({}, { router: { onPush } });

    // A real drag-to-select is a single pointer gesture: press, move (which
    // extends the selection), then release (which fires the click). Setting
    // a selection via the Range API and firing a separate click wouldn't
    // work here since a plain click's own mousedown handling collapses any
    // pre-existing selection first, same as in a real browser.
    const cell = screen.getByText('wf-1');
    await user.pointer([
      { target: cell, offset: 0, keys: '[MouseLeft>]' },
      { target: cell, offset: 4 },
      { keys: '[/MouseLeft]' },
    ]);

    expect(window.getSelection()?.toString()).toBe('wf-1');
    expect(onPush).not.toHaveBeenCalled();
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

  it('does not render checkboxes when selection is not provided', () => {
    setup({});

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a select-all checkbox and one checkbox per row when selection is provided', () => {
    setup({ selection: makeSelection() });

    // select-all + one per row
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(
      screen.getByRole('checkbox', { name: 'Select all workflows' })
    ).toBeInTheDocument();
  });

  it('toggles a row without navigating when its checkbox is clicked', async () => {
    const selection = makeSelection();
    const { user } = setup({ selection });

    await user.click(
      screen.getByRole('checkbox', { name: 'Select workflow wf-1 run run-1' })
    );

    expect(selection.onToggle).toHaveBeenCalledTimes(1);
    expect(selection.onToggle).toHaveBeenCalledWith(MOCK_WORKFLOWS[0]);
  });

  it('calls onToggleAll when the select-all checkbox is clicked', async () => {
    const selection = makeSelection();
    const { user } = setup({ selection });

    await user.click(
      screen.getByRole('checkbox', { name: 'Select all workflows' })
    );

    expect(selection.onToggleAll).toHaveBeenCalledTimes(1);
  });

  it('renders rows checked and disabled while select all is active', () => {
    setup({
      selection: makeSelection({
        isAllSelected: true,
        isRowToggleDisabled: true,
        isSelected: () => true,
      }),
    });

    const rowCheckbox = screen.getByRole('checkbox', {
      name: 'Select workflow wf-1 run run-1',
    });
    expect(rowCheckbox).toBeChecked();
    expect(rowCheckbox).toBeDisabled();
  });

  it('does not toggle a disabled row checkbox', async () => {
    const selection = makeSelection({
      isAllSelected: true,
      isRowToggleDisabled: true,
      isSelected: () => true,
    });
    const { user } = setup({ selection });

    await user.click(
      screen.getByRole('checkbox', { name: 'Select workflow wf-1 run run-1' })
    );

    expect(selection.onToggle).not.toHaveBeenCalled();
  });

  it('shows the disabled-reason tooltip when hovering a disabled row checkbox', async () => {
    const { user } = setup({
      selection: makeSelection({
        isAllSelected: true,
        isRowToggleDisabled: true,
        isSelected: () => true,
        rowToggleDisabledReason: 'All selected',
      }),
    });

    await user.hover(
      screen.getByRole('checkbox', { name: 'Select workflow wf-1 run run-1' })
    );

    expect(await screen.findByText('All selected')).toBeInTheDocument();
  });
});

function makeSelection(
  overrides: Partial<
    React.ComponentProps<typeof WorkflowsList>['selection']
  > = {}
): NonNullable<React.ComponentProps<typeof WorkflowsList>['selection']> {
  return {
    isAllSelected: false,
    onToggleAll: jest.fn(),
    isSelected: () => false,
    isRowToggleDisabled: false,
    onToggle: jest.fn(),
    ...overrides,
  };
}

function setup(
  {
    workflows = MOCK_WORKFLOWS,
    columns = mockWorkflowsListColumns,
    error = null,
    hasNextPage = false,
    isFetchingNextPage = false,
    sortParams,
    selection,
  }: Partial<React.ComponentProps<typeof WorkflowsList>> = {},
  providerProps?: PublicProviderProps
) {
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
      selection={selection}
    />,
    providerProps
  );
  return { user };
}
