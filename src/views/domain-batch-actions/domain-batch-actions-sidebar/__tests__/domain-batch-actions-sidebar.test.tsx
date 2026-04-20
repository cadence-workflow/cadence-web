import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import {
  type BatchAction,
  type SelectedId,
} from '../../domain-batch-actions.types';
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

const mockBatchActions: BatchAction[] = [
  { id: 4, status: 'running', progress: 60, actionType: 'cancel' },
  { id: 3, status: 'completed', actionType: 'cancel' },
  { id: 2, status: 'aborted', actionType: 'cancel' },
  { id: 1, status: 'failed', actionType: 'cancel' },
];

function setup({
  batchActions = mockBatchActions,
  hasDraft = false,
  selectedId = null,
  onSelect = jest.fn(),
  onCreateNew = jest.fn(),
}: {
  batchActions?: BatchAction[];
  hasDraft?: boolean;
  selectedId?: SelectedId;
  onSelect?: (id: number | 'draft') => void;
  onCreateNew?: () => void;
} = {}) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionsSidebar
      batchActions={batchActions}
      hasDraft={hasDraft}
      selectedId={selectedId}
      onSelect={onSelect}
      onCreateNew={onCreateNew}
    />
  );
  return { user, onSelect, onCreateNew };
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

    expect(screen.getByText('Batch action #4')).toBeInTheDocument();
    expect(screen.getByText('Batch action #3')).toBeInTheDocument();
    expect(screen.getByText('Batch action #2')).toBeInTheDocument();
    expect(screen.getByText('Batch action #1')).toBeInTheDocument();
  });

  it('renders correct status icons for each status', () => {
    setup();

    expect(screen.getByText('Spinner')).toBeInTheDocument();
    expect(screen.getByText('Check Icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel Icon')).toBeInTheDocument();
    expect(screen.getByText('Warning Icon')).toBeInTheDocument();
  });

  it('calls onSelect with the action id when a batch action is clicked', async () => {
    const { user, onSelect } = setup();

    await user.click(screen.getByText('Batch action #2'));

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('calls onCreateNew when the new batch action button is clicked', async () => {
    const { user, onCreateNew } = setup();

    await user.click(screen.getByText('New batch action'));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it('renders draft row with "Untitled batch action" label and edit icon when hasDraft is true', () => {
    setup({ hasDraft: true, selectedId: 'draft' });

    expect(screen.getByText('Untitled batch action')).toBeInTheDocument();
    expect(screen.getByText('Edit Icon')).toBeInTheDocument();
  });

  it('calls onSelect with "draft" when the draft row is clicked', async () => {
    const { user, onSelect } = setup({ hasDraft: true, selectedId: 4 });

    await user.click(screen.getByText('Untitled batch action'));

    expect(onSelect).toHaveBeenCalledWith('draft');
  });
});
