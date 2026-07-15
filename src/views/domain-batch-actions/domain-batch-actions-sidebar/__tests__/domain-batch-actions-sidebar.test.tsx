import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { userEvent } from '@testing-library/user-event';

import { render, screen, waitFor } from '@/test-utils/rtl';

import {
  type BatchActionListItem,
  type BatchActionStatus,
} from '@/route-handlers/list-batch-actions/list-batch-actions.types';

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
  selectedActionDetailStatus = undefined,
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
  selectedActionDetailStatus?: BatchActionStatus;
  onSelectAction?: (action: BatchActionListItem) => void;
  onSelectDraft?: () => void;
  onCreateNew?: () => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  error?: Error | null;
} = {}) {
  const user = userEvent.setup();
  const props = {
    batchActions,
    isDraftOpen,
    isDraftSelected,
    selectedActionId,
    selectedActionDetailStatus,
    onSelectAction,
    onSelectDraft,
    onCreateNew,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  };
  const { rerender } = render(<DomainBatchActionsSidebar {...props} />);
  return {
    user,
    onSelectAction,
    onSelectDraft,
    onCreateNew,
    fetchNextPage,
    rerender: (nextProps: Partial<typeof props>) =>
      rerender(<DomainBatchActionsSidebar {...props} {...nextProps} />),
  };
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

  it('invalidates the list and the detail when the selected statuses differ', async () => {
    const invalidateQueriesSpy = jest.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    );

    // List says action 4 is RUNNING, detail reports COMPLETED → stale copy.
    setup({ selectedActionId: '4', selectedActionDetailStatus: 'COMPLETED' });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['listBatchActions'] })
      );
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['describeBatchAction'] })
    );
  });

  it('does not invalidate anything when the selected statuses match', () => {
    const invalidateQueriesSpy = jest.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    );

    setup({ selectedActionId: '4', selectedActionDetailStatus: 'RUNNING' });

    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['listBatchActions'] })
    );
    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['describeBatchAction'] })
    );
  });

  it('re-checks on re-selection even when the status pair is unchanged', async () => {
    const invalidateQueriesSpy = jest.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    );

    // Action 4 (RUNNING in list) selected with a COMPLETED detail → stale.
    const { rerender } = setup({
      selectedActionId: '4',
      selectedActionDetailStatus: 'COMPLETED',
    });
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
    const callsAfterFirst = invalidateQueriesSpy.mock.calls.length;

    // Select action 3 (COMPLETED in both list and detail) → nothing to do.
    rerender({
      selectedActionId: '3',
      selectedActionDetailStatus: 'COMPLETED',
    });

    // Back to action 4: same (COMPLETED detail / RUNNING list) pair as before,
    // so the status deps are unchanged — only selectedActionId flips back. The
    // list must still be refreshed.
    rerender({
      selectedActionId: '4',
      selectedActionDetailStatus: 'COMPLETED',
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy.mock.calls.length).toBeGreaterThan(
        callsAfterFirst
      );
    });
  });
});
