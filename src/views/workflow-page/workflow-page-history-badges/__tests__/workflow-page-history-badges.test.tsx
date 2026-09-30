import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import WorkflowPageHistoryBadges from '../workflow-page-history-badges';

jest.mock(
  '../../workflow-page-pending-events-badge/workflow-page-pending-events-badge',
  () =>
    function MockPendingEventsBadge() {
      return <div>Mock pending badge</div>;
    }
);

jest.mock(
  '../../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge',
  () =>
    function MockDiagnosticsBadge() {
      return <div>Mock diagnostics badge</div>;
    }
);

describe(WorkflowPageHistoryBadges.name, () => {
  it('renders pending and diagnostics badges when diagnostics in history is enabled', async () => {
    setup({ isDiagnosticsInHistoryEnabled: true });

    const diagnosticsBadge = await screen.findByText('Mock diagnostics badge');
    const pendingBadge = screen.getByText('Mock pending badge');

    expect(
      pendingBadge.compareDocumentPosition(diagnosticsBadge) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('renders only the pending badge when diagnostics in history is disabled', async () => {
    const { mockConfigResolver } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    await waitFor(() => expect(mockConfigResolver).toHaveBeenCalled());

    expect(screen.getByText('Mock pending badge')).toBeInTheDocument();
    expect(
      screen.queryByText('Mock diagnostics badge')
    ).not.toBeInTheDocument();
  });

  it('renders only the pending badge when the config request fails', async () => {
    const { mockConfigResolver } = setup({ isConfigError: true });

    await waitFor(() => expect(mockConfigResolver).toHaveBeenCalled());

    expect(screen.getByText('Mock pending badge')).toBeInTheDocument();
    expect(
      screen.queryByText('Mock diagnostics badge')
    ).not.toBeInTheDocument();
  });
});

function setup({
  isDiagnosticsInHistoryEnabled = false,
  isConfigError = false,
}: {
  isDiagnosticsInHistoryEnabled?: boolean;
  isConfigError?: boolean;
}) {
  const mockConfigResolver = jest.fn(() => {
    if (isConfigError) {
      return HttpResponse.json(
        { message: 'Failed to fetch config' },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      isDiagnosticsInHistoryEnabled satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'>
    );
  });

  render(<WorkflowPageHistoryBadges />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: mockConfigResolver,
      },
    ],
  });

  return { mockConfigResolver };
}
