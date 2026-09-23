import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import WorkflowPageHistoryTabBadges from '../workflow-page-history-tab-badges';

jest.mock(
  '../../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge',
  () =>
    function MockWorkflowPageDiagnosticsBadge() {
      return <span>diagnostics badge</span>;
    }
);

jest.mock(
  '../../workflow-page-pending-events-badge/workflow-page-pending-events-badge',
  () =>
    function MockWorkflowPagePendingEventsBadge() {
      return <span>pending badge</span>;
    }
);

describe(WorkflowPageHistoryTabBadges.name, () => {
  it('renders diagnostics badge and pending badge when diagnostics in history is enabled', async () => {
    setup({ isDiagnosticsInHistoryEnabled: true });

    expect(await screen.findByText('diagnostics badge')).toBeInTheDocument();
    expect(screen.getByText('pending badge')).toBeInTheDocument();
  });

  it('hides diagnostics badge when diagnostics in history is disabled', async () => {
    setup({ isDiagnosticsInHistoryEnabled: false });

    await waitFor(() => {
      expect(screen.getByText('pending badge')).toBeInTheDocument();
      expect(screen.queryByText('diagnostics badge')).not.toBeInTheDocument();
    });
  });
});

function setup({
  isDiagnosticsInHistoryEnabled = false,
}: {
  isDiagnosticsInHistoryEnabled?: boolean;
} = {}) {
  render(<WorkflowPageHistoryTabBadges />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: async () =>
          HttpResponse.json(isDiagnosticsInHistoryEnabled),
      },
    ],
  });
}
