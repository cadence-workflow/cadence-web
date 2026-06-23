import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionDetail from '../domain-batch-actions-detail';
import { type Props } from '../domain-batch-actions-detail.types';

jest.mock(
  '../../domain-batch-actions-progress-bar/domain-batch-actions-progress-bar',
  () =>
    function MockProgressBar({ status }: { status: string }) {
      return <div>Mock progress bar: {status}</div>;
    }
);

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
    const action: BatchAction = {
      runId: '5',
      status: 'COMPLETED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    const action: BatchAction = {
      runId: '3',
      status: 'RUNNING',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    const action: BatchAction = {
      runId: '2',
      status: 'COMPLETED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    const action: BatchAction = {
      runId: '1',
      status: 'ABORTED',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} />);

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('keeps the title and abort button while loading details', () => {
    const action: BatchAction = {
      runId: '7',
      status: 'RUNNING',
      actionType: 'cancel',
    };

    render(<DomainBatchActionDetail batchAction={action} loading />);

    // Header chrome keeps rendering — runId and status come from the slim list item.
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

  it('renders the progress bar with the batch action status', () => {
    setup({
      batchAction: {
        runId: '8',
        status: 'RUNNING',
        progress: PROGRESS,
      },
    });

    expect(screen.getByText('Mock progress bar: RUNNING')).toBeInTheDocument();
  });

  it('does not render the progress bar when there is no status', () => {
    setup({ loading: true });

    expect(screen.queryByText(/Mock progress bar/)).not.toBeInTheDocument();
  });
});

function setup({ batchAction, loading }: Partial<Props> = {}) {
  render(
    <DomainBatchActionDetail batchAction={batchAction} loading={loading} />
  );
}
