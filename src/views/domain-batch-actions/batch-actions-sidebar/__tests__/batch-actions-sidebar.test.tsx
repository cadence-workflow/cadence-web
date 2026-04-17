import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import BatchActionsSidebar from '../batch-actions-sidebar';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdAdd: () => <div>Add Icon</div>,
  MdCheckCircle: () => <div>Check Icon</div>,
  MdOutlineCancel: () => <div>Cancel Icon</div>,
  MdWarning: () => <div>Warning Icon</div>,
}));

jest.mock('baseui/spinner', () => ({
  Spinner: jest.fn(() => <div>Spinner</div>),
}));

const mockBatchActions: BatchAction[] = [
  { id: 4, status: 'running', progress: 60 },
  { id: 3, status: 'completed' },
  { id: 2, status: 'aborted' },
  { id: 1, status: 'failed' },
];

describe(BatchActionsSidebar.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the new batch action button', () => {
    render(
      <BatchActionsSidebar
        batchActions={mockBatchActions}
        selectedId={null}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('New batch action')).toBeInTheDocument();
  });

  it('renders batch history label', () => {
    render(
      <BatchActionsSidebar
        batchActions={mockBatchActions}
        selectedId={null}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Batch history')).toBeInTheDocument();
  });

  it('renders all batch actions in the list', () => {
    render(
      <BatchActionsSidebar
        batchActions={mockBatchActions}
        selectedId={null}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Batch action #4')).toBeInTheDocument();
    expect(screen.getByText('Batch action #3')).toBeInTheDocument();
    expect(screen.getByText('Batch action #2')).toBeInTheDocument();
    expect(screen.getByText('Batch action #1')).toBeInTheDocument();
  });

  it('renders correct status icons for each status', () => {
    render(
      <BatchActionsSidebar
        batchActions={mockBatchActions}
        selectedId={null}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Spinner')).toBeInTheDocument();
    expect(screen.getByText('Check Icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel Icon')).toBeInTheDocument();
    expect(screen.getByText('Warning Icon')).toBeInTheDocument();
  });

  it('calls onSelect when a batch action is clicked', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <BatchActionsSidebar
        batchActions={mockBatchActions}
        selectedId={null}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('Batch action #2'));

    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
