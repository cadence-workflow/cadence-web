import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import BatchActionDetail from '../batch-action-detail';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdOutlineCancel: () => <div>Cancel Icon</div>,
}));

describe(BatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the batch action title', () => {
    const action: BatchAction = { id: 5, status: 'completed' };

    render(<BatchActionDetail batchAction={action} />);

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    const action: BatchAction = { id: 3, status: 'running', progress: 60 };

    render(<BatchActionDetail batchAction={action} />);

    expect(screen.getByText('Abort')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    const action: BatchAction = { id: 2, status: 'completed' };

    render(<BatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    const action: BatchAction = { id: 1, status: 'aborted' };

    render(<BatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort')).not.toBeInTheDocument();
  });
});
