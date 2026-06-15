import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionDetail from '../domain-batch-actions-detail';
import { type Props } from '../domain-batch-actions-detail.types';

const PROGRESS: BatchAction['progress'] = {
  totalEstimate: 200,
  successCount: 120,
  errorCount: 5,
};

describe(DomainBatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the batch action title', () => {
    setup({
      batchAction: { id: '5', status: 'COMPLETED', actionType: 'cancel' },
    });

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    setup({
      batchAction: { id: '3', status: 'RUNNING', actionType: 'cancel' },
    });

    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    setup({
      batchAction: { id: '2', status: 'COMPLETED', actionType: 'cancel' },
    });

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    setup({
      batchAction: { id: '1', status: 'ABORTED', actionType: 'cancel' },
    });

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('keeps the title and abort button while loading details', () => {
    setup({
      batchAction: { id: '7', status: 'RUNNING', actionType: 'cancel' },
      loading: true,
    });

    // Header chrome keeps rendering — id and status come from the slim list item.
    expect(screen.getByText('Batch action #7')).toBeInTheDocument();
    expect(screen.getByText('Abort batch action')).toBeInTheDocument();

    // Field-level values do not render while skeleton placeholders are shown.
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders no title or abort button before any details have loaded', () => {
    setup({ loading: true });

    expect(screen.queryByText(/Batch action #/)).not.toBeInTheDocument();
    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('renders a labelled progress bar with the completed-out-of-total count', () => {
    setup({
      batchAction: { id: '8', status: 'RUNNING', progress: PROGRESS },
    });

    // completed = successCount + errorCount = 125
    expect(
      screen.getByText('125 out of 200 workflows completed')
    ).toBeInTheDocument();
  });

  it('renders an indeterminate progress bar while running with no counts yet', () => {
    setup({ batchAction: { id: '9', status: 'RUNNING' } });

    expect(screen.getByText('Calculating progress…')).toBeInTheDocument();
    expect(screen.queryByText(/workflows completed/)).not.toBeInTheDocument();
  });

  it('renders the final progress bar for a completed batch with counts', () => {
    setup({
      batchAction: { id: '10', status: 'COMPLETED', progress: PROGRESS },
    });

    expect(
      screen.getByText('125 out of 200 workflows completed')
    ).toBeInTheDocument();
  });

  it('does not render a progress bar for a completed batch without counts', () => {
    setup({ batchAction: { id: '11', status: 'COMPLETED' } });

    expect(screen.queryByText(/workflows completed/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('does not render a progress bar for an aborted batch', () => {
    setup({ batchAction: { id: '12', status: 'ABORTED', progress: PROGRESS } });

    expect(screen.queryByText(/workflows completed/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('renders the last known progress bar for a failed batch with counts', () => {
    setup({
      batchAction: { id: '13', status: 'FAILED', progress: PROGRESS },
    });

    // completed = successCount + errorCount = 125; failed wording, not "completed"
    expect(
      screen.getByText('Stopped at 125 out of 200 workflows')
    ).toBeInTheDocument();
  });

  it('does not render a progress bar for a failed batch without counts', () => {
    setup({ batchAction: { id: '14', status: 'FAILED' } });

    expect(screen.queryByText(/out of .* workflows/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });
});

function setup({ batchAction, loading }: Partial<Props> = {}) {
  render(
    <DomainBatchActionDetail batchAction={batchAction} loading={loading} />
  );
}
