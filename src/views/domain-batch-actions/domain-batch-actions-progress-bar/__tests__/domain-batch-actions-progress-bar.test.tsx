import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchActionProgress } from '../../domain-batch-actions.types';
import DomainBatchActionsProgressBar from '../domain-batch-actions-progress-bar';
import { type Props } from '../domain-batch-actions-progress-bar.types';

const PROGRESS: BatchActionProgress = {
  totalEstimate: 200,
  successCount: 120,
  errorCount: 5,
};

describe(DomainBatchActionsProgressBar.name, () => {
  it('renders a labelled progress bar with the completed-out-of-total count', () => {
    setup({ status: 'RUNNING', progress: PROGRESS });

    // completed = successCount + errorCount = 125
    expect(
      screen.getByText('125 out of 200 workflows completed')
    ).toBeInTheDocument();
  });

  it('renders an indeterminate progress bar while running with no counts yet', () => {
    setup({ status: 'RUNNING' });

    expect(screen.getByText('Calculating progress…')).toBeInTheDocument();
    expect(screen.queryByText(/workflows completed/)).not.toBeInTheDocument();
  });

  it('renders the final progress bar for a completed batch with counts', () => {
    setup({ status: 'COMPLETED', progress: PROGRESS });

    expect(
      screen.getByText('125 out of 200 workflows completed')
    ).toBeInTheDocument();
  });

  it('renders nothing for a completed batch without counts', () => {
    setup({ status: 'COMPLETED' });

    expect(screen.queryByText(/workflows completed/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('renders nothing for an aborted batch', () => {
    setup({ status: 'ABORTED', progress: PROGRESS });

    expect(screen.queryByText(/workflows/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('renders the last known progress bar for a failed batch with counts', () => {
    setup({ status: 'FAILED', progress: PROGRESS });

    // completed = successCount + errorCount = 125; failed wording, not "completed"
    expect(
      screen.getByText('Stopped at 125 out of 200 workflows')
    ).toBeInTheDocument();
  });

  it('renders nothing for a failed batch without counts', () => {
    setup({ status: 'FAILED' });

    expect(screen.queryByText(/out of .* workflows/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });
});

function setup({ status = 'RUNNING', progress }: Partial<Props> = {}) {
  render(<DomainBatchActionsProgressBar status={status} progress={progress} />);
}
