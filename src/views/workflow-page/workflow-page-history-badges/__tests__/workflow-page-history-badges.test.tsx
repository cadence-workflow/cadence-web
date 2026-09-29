import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import * as useConfigValueModule from '@/hooks/use-config-value/use-config-value';

import WorkflowPageHistoryBadges from '../workflow-page-history-badges';

// TODO: remove with old diagnostics view. Direct mock keeps these tests sync, reducing code to clean up.
jest.mock('@/hooks/use-config-value/use-config-value', () =>
  jest.fn(() => ({ data: false }))
);

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
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders pending and diagnostics badges when diagnostics in history is enabled', () => {
    setup({ isDiagnosticsInHistoryEnabled: true });

    const pendingBadge = screen.getByText('Mock pending badge');
    const diagnosticsBadge = screen.getByText('Mock diagnostics badge');

    expect(pendingBadge).toBeInTheDocument();
    expect(diagnosticsBadge).toBeInTheDocument();
    expect(
      pendingBadge.compareDocumentPosition(diagnosticsBadge) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('renders only the pending badge when diagnostics in history is disabled', () => {
    setup({ isDiagnosticsInHistoryEnabled: false });

    expect(screen.getByText('Mock pending badge')).toBeInTheDocument();
    expect(
      screen.queryByText('Mock diagnostics badge')
    ).not.toBeInTheDocument();
  });

  it('renders only the pending badge while the config value is loading', () => {
    setup({ isDiagnosticsInHistoryEnabled: undefined });

    expect(screen.getByText('Mock pending badge')).toBeInTheDocument();
    expect(
      screen.queryByText('Mock diagnostics badge')
    ).not.toBeInTheDocument();
  });
});

function setup({
  isDiagnosticsInHistoryEnabled,
}: {
  isDiagnosticsInHistoryEnabled: boolean | undefined;
}) {
  jest.spyOn(useConfigValueModule, 'default').mockReturnValue({
    data: isDiagnosticsInHistoryEnabled,
  } as ReturnType<typeof useConfigValueModule.default>);

  return render(<WorkflowPageHistoryBadges />);
}
