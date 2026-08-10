import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchActionProgress } from '@/route-handlers/describe-batch-action/describe-batch-action.types';

import DomainBatchActionsProgressBar from '../domain-batch-actions-progress-bar';
import { type Props } from '../domain-batch-actions-progress-bar.types';

const PROGRESS: BatchActionProgress = {
  totalEstimate: 200,
  successCount: 120,
  errorCount: 5,
};

describe(DomainBatchActionsProgressBar.name, () => {
  it('renders an action-specific label with the completed-out-of-total count', () => {
    setup({ status: 'RUNNING', progress: PROGRESS, actionType: 'terminate' });

    // completed = successCount + errorCount = 125
    expect(
      screen.getByText('Terminated 125 of 200 workflows:')
    ).toBeInTheDocument();
  });

  it('falls back to a generic verb when the action type is missing', () => {
    setup({ status: 'RUNNING', progress: PROGRESS });

    expect(
      screen.getByText('Processed 125 of 200 workflows:')
    ).toBeInTheDocument();
  });

  it('renders the succeeded, failed and remaining counts', () => {
    setup({ status: 'RUNNING', progress: PROGRESS, actionType: 'terminate' });

    expect(screen.getByText('120 succeeded')).toBeInTheDocument();
    expect(screen.getByText('5 failed')).toBeInTheDocument();
    // remaining = total - completed = 200 - 125 = 75
    expect(screen.getByText('75 remaining')).toBeInTheDocument();
  });

  it('renders zero failed and remaining counts when everything succeeded', () => {
    setup({
      status: 'COMPLETED',
      actionType: 'terminate',
      progress: { totalEstimate: 200, successCount: 200, errorCount: 0 },
    });

    expect(screen.getByText('200 succeeded')).toBeInTheDocument();
    expect(screen.getByText('0 failed')).toBeInTheDocument();
    expect(screen.getByText('0 skipped')).toBeInTheDocument();
  });

  it('renders an indeterminate progress bar while running with no counts yet', () => {
    setup({ status: 'RUNNING' });

    expect(screen.getByText('Calculating progress…')).toBeInTheDocument();
    expect(screen.queryByText(/workflows:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/succeeded/)).not.toBeInTheDocument();
  });

  it('renders the final label for a completed batch with counts', () => {
    setup({ status: 'COMPLETED', progress: PROGRESS, actionType: 'cancel' });

    expect(
      screen.getByText('Cancelled 125 of 200 workflows:')
    ).toBeInTheDocument();
    expect(screen.getByText('120 succeeded')).toBeInTheDocument();
    expect(screen.getByText('5 failed')).toBeInTheDocument();
    expect(screen.getByText('75 skipped')).toBeInTheDocument();
  });

  it('renders nothing for a completed batch without counts', () => {
    setup({ status: 'COMPLETED' });

    expect(screen.queryByText(/workflows:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('renders nothing for an aborted batch', () => {
    setup({ status: 'ABORTED', progress: PROGRESS });

    expect(screen.queryByText(/workflows:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });

  it('renders the last known label for a failed batch with counts', () => {
    setup({ status: 'FAILED', progress: PROGRESS, actionType: 'terminate' });

    expect(
      screen.getByText('Terminated 125 of 200 workflows:')
    ).toBeInTheDocument();
    expect(screen.getByText('120 succeeded')).toBeInTheDocument();
    expect(screen.getByText('5 failed')).toBeInTheDocument();
    expect(screen.getByText('75 skipped')).toBeInTheDocument();
  });

  it('renders nothing for a failed batch without counts', () => {
    setup({ status: 'FAILED' });

    expect(screen.queryByText(/workflows:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Calculating progress…')).not.toBeInTheDocument();
  });
});

function setup({
  status = 'RUNNING',
  progress,
  actionType,
}: Partial<Props> = {}) {
  render(
    <DomainBatchActionsProgressBar
      status={status}
      progress={progress}
      actionType={actionType}
    />
  );
}
