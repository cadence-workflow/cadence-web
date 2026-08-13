import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type PublicProviderProps } from '@/test-utils/rtl.types';

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

jest.mock(
  '../../domain-batch-actions-rps-value/domain-batch-actions-rps-value',
  () =>
    function MockRpsValue({ batchAction }: any) {
      return <div>Mock rps value: {batchAction.rps}</div>;
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
  it('fires a terminate request when the abort button is clicked', async () => {
    let terminateUrl = '';
    const { user } = setup({
      batchAction: { runId: '3', status: 'RUNNING', actionType: 'cancel' },
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/terminate',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            terminateUrl = new URL(request.url).pathname;
            return HttpResponse.json({});
          },
        },
      ],
    });

    await user.click(screen.getByText('Abort batch action'));

    await waitFor(() => {
      expect(terminateUrl).toBe(
        '/api/domains/cadence-batcher/cluster1/workflows/workflow1/3/terminate'
      );
    });
  });
});

function setup({
  endpointsMocks,
  ...props
}: Partial<Props> & {
  endpointsMocks?: PublicProviderProps['endpointsMocks'];
} = {}) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionDetail
      domain="domain1"
      cluster="cluster1"
      workflowId="workflow1"
      {...props}
    />,
    endpointsMocks ? { endpointsMocks } : undefined
  );
  return { user };
}
