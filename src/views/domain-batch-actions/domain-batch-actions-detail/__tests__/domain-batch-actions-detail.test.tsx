import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

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

const mockEditRps = jest.fn();
jest.mock('../../hooks/use-edit-batch-action-rps', () => ({
  __esModule: true,
  default: () => ({ editRps: mockEditRps, isPending: false }),
}));

jest.mock(
  '../../domain-batch-actions-edit-rps-modal/domain-batch-actions-edit-rps-modal',
  () =>
    function MockEditRpsModal({ isOpen, onSubmit, onClose }: any) {
      if (!isOpen) return null;
      return (
        <div>
          <span>mock-edit-rps-modal</span>
          <button onClick={() => onSubmit(250)}>mock-save</button>
          <button onClick={onClose}>mock-close</button>
        </div>
      );
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
    setup({
      batchAction: { runId: '5', status: 'COMPLETED', actionType: 'cancel' },
    });

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
  });

  it('shows abort button when status is running', () => {
    setup({
      batchAction: { runId: '3', status: 'RUNNING', actionType: 'cancel' },
    });

    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('does not show abort button when status is completed', () => {
    setup({
      batchAction: { runId: '2', status: 'COMPLETED', actionType: 'cancel' },
    });

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('does not show abort button when status is aborted', () => {
    setup({
      batchAction: { runId: '1', status: 'ABORTED', actionType: 'cancel' },
    });

    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('keeps the title and abort button while loading details', () => {
    setup({
      batchAction: { runId: '7', status: 'RUNNING', actionType: 'cancel' },
      loading: true,
    });

    // Header chrome keeps rendering — runId and status come from the slim list item.
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

  it('opens the edit RPS modal when the RPS Edit button is clicked', async () => {
    const { user } = setup({
      batchAction: {
        runId: '9',
        status: 'RUNNING',
        actionType: 'cancel',
        rps: 100,
      },
    });

    expect(screen.queryByText('mock-edit-rps-modal')).not.toBeInTheDocument();

    await user.click(screen.getByText('Edit'));

    expect(screen.getByText('mock-edit-rps-modal')).toBeInTheDocument();
  });

  it('submits the new RPS through the edit hook', async () => {
    const { user } = setup({
      batchAction: {
        runId: '9',
        status: 'RUNNING',
        actionType: 'cancel',
        rps: 100,
      },
    });

    await user.click(screen.getByText('Edit'));
    await user.click(screen.getByText('mock-save'));

    expect(mockEditRps).toHaveBeenCalledWith(250);
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionDetail
      domain="domain1"
      cluster="cluster1"
      workflowId="workflow1"
      {...props}
    />
  );
  return { user };
}
