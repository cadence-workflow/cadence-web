import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import DomainBatchActionsSidebar from '../domain-batch-actions-sidebar';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdCheckCircle: () => <div>Check Icon</div>,
  MdOutlineCancel: () => <div>Cancel Icon</div>,
  MdOutlineEdit: () => <div>Edit Icon</div>,
  MdWarning: () => <div>Warning Icon</div>,
}));

jest.mock('baseui/spinner', () => ({
  Spinner: jest.fn(() => <div>Spinner</div>),
}));

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () => ({
    __esModule: true,
    default: ({ hasData }: { hasData: boolean }) => (
      <div data-testid="mock-loader" data-has-data={String(hasData)} />
    ),
  })
);

const mockBatchActions: BatchActionListItem[] = [
  { workflowId: 'wf-4', runId: '4', status: 'RUNNING' },
  { workflowId: 'wf-3', runId: '3', status: 'COMPLETED' },
  { workflowId: 'wf-2', runId: '2', status: 'ABORTED' },
  { workflowId: 'wf-1', runId: '1', status: 'FAILED' },
];

function setup({
  batchActions = mockBatchActions,
  isDraftOpen = false,
  isDraftSelected = false,
  selectedActionId = null,
  onSelectAction = jest.fn(),
  onSelectDraft = jest.fn(),
  onCreateNew = jest.fn(),
  fetchNextPage = jest.fn(),
  hasNextPage = false,
  isFetchingNextPage = false,
  error = null,
}: {
  batchActions?: BatchActionListItem[];
  isDraftOpen?: boolean;
  isDraftSelected?: boolean;
  selectedActionId?: string | null;
  onSelectAction?: (action: BatchActionListItem) => void;
  onSelectDraft?: () => void;
  onCreateNew?: () => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  error?: Error | null;
} = {}) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionsSidebar
      batchActions={batchActions}
      isDraftOpen={isDraftOpen}
      isDraftSelected={isDraftSelected}
      selectedActionId={selectedActionId}
      onSelectAction={onSelectAction}
      onSelectDraft={onSelectDraft}
      onCreateNew={onCreateNew}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
    />
  );
  return { user, onSelectAction, onSelectDraft, onCreateNew, fetchNextPage };
}

describe(DomainBatchActionsSidebar.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the new batch action button', () => {
    setup();

    expect(screen.getByText('New batch action')).toBeInTheDocument();
  });

  it('renders batch history label', () => {
    setup();

    expect(screen.getByText('Batch history')).toBeInTheDocument();
  });

  it('renders all batch actions in the list', () => {
    setup();

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders correct status icons for each status', () => {
    setup();

    expect(screen.getByText('Spinner')).toBeInTheDocument();
    expect(screen.getByText('Check Icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel Icon')).toBeInTheDocument();
    expect(screen.getByText('Warning Icon')).toBeInTheDocument();
  });

  it('calls onSelectAction with the action when a batch action is clicked', async () => {
    const { user, onSelectAction } = setup();

    await user.click(screen.getByText('2'));

    expect(onSelectAction).toHaveBeenCalledWith({
      workflowId: 'wf-2',
      runId: '2',
      status: 'ABORTED',
    });
  });

  it('calls onCreateNew when the new batch action button is clicked', async () => {
    const { user, onCreateNew } = setup();

    await user.click(screen.getByText('New batch action'));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it('renders draft row with "Untitled batch action" label and edit icon when isDraftOpen is true', () => {
    setup({ isDraftOpen: true, isDraftSelected: true });

    expect(screen.getByText('Untitled batch action')).toBeInTheDocument();
    expect(screen.getByText('Edit Icon')).toBeInTheDocument();
  });

  it('calls onSelectDraft when the draft row is clicked', async () => {
    const { user, onSelectDraft } = setup({
      isDraftOpen: true,
      isDraftSelected: false,
      selectedActionId: '4',
    });

    await user.click(screen.getByText('Untitled batch action'));

    expect(onSelectDraft).toHaveBeenCalledTimes(1);
  });

  it('does not render the loader when there is no next page, no in-flight fetch, and no error', () => {
    setup({ hasNextPage: false, isFetchingNextPage: false, error: null });

    expect(screen.queryByTestId('mock-loader')).not.toBeInTheDocument();
  });

  it('renders the loader when hasNextPage is true', () => {
    setup({ hasNextPage: true });

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  it('renders the loader when isFetchingNextPage is true', () => {
    setup({ isFetchingNextPage: true });

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  it('renders the loader when error is set', () => {
    setup({ error: new Error('boom') });

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  it('passes hasData=true to the loader when batchActions is non-empty', () => {
    setup({ hasNextPage: true });

    expect(screen.getByTestId('mock-loader')).toHaveAttribute(
      'data-has-data',
      'true'
    );
  });

  it('passes hasData=false to the loader when batchActions is empty', () => {
    setup({ batchActions: [], hasNextPage: true });

    expect(screen.getByTestId('mock-loader')).toHaveAttribute(
      'data-has-data',
      'false'
    );
  });
});
