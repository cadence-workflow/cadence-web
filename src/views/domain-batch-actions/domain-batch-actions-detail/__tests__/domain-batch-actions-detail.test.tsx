import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionDetail from '../domain-batch-actions-detail';

describe(DomainBatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the batch action title', () => {
    const action: BatchAction = {
      id: '5',
      status: 'COMPLETED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    const action: BatchAction = {
      id: '3',
      status: 'RUNNING',
      progress: 60,
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    const action: BatchAction = {
      id: '2',
      status: 'COMPLETED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    const action: BatchAction = {
      id: '1',
      status: 'ABORTED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('keeps the title and abort button while loading details', () => {
    const action: BatchAction = {
      id: '7',
      status: 'RUNNING',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} loading />);

    // Header chrome keeps rendering whenever a batch action is present.
    expect(screen.getByText('Batch action #7')).toBeInTheDocument();
    expect(screen.getByText('Abort batch action')).toBeInTheDocument();

    // Field-level values do not render while skeleton placeholders are shown.
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders no title or abort button before any details have loaded', () => {
    render(<DomainBatchActionDetail loading />);

    expect(screen.queryByText(/Batch action #/)).not.toBeInTheDocument();
    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });
});
