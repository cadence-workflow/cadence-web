import React from 'react';

import { render, screen } from '@/test-utils/rtl';

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
  it('renders the pending and diagnostics badges', () => {
    setup();

    expect(screen.getByText('Mock pending badge')).toBeInTheDocument();
    expect(screen.getByText('Mock diagnostics badge')).toBeInTheDocument();
  });
});

function setup() {
  render(<WorkflowPageHistoryBadges />);
}
