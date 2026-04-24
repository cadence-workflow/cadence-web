import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionDetail from '../domain-batch-action-detail';

describe(DomainBatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the batch action title', () => {
    const action: BatchAction = {
      id: '5',
      status: 'completed',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    const action: BatchAction = {
      id: '3',
      status: 'running',
      progress: 60,
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    const action: BatchAction = {
      id: '2',
      status: 'completed',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    const action: BatchAction = {
      id: '1',
      status: 'aborted',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });
});
