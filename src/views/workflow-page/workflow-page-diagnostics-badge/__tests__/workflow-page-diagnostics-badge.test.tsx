import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import * as useWorkflowDiagnosticsIssuesCountModule from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import WorkflowPageDiagnosticsBadge from '../workflow-page-diagnostics-badge';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'cluster_1',
    workflowId: 'mock-workflow-id',
    runId: 'mock-run-id',
  }),
}));

jest.mock('@/views/shared/hooks/use-workflow-diagnostics-issues-count', () =>
  jest.fn(() => undefined)
);

describe(WorkflowPageDiagnosticsBadge.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render badge with singular issue text when count is 1', () => {
    jest
      .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
      .mockReturnValue(1);

    render(<WorkflowPageDiagnosticsBadge />);

    expect(screen.getByText('1 issue')).toBeInTheDocument();
  });

  it('should render badge with plural issues text when count is greater than 1', () => {
    jest
      .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
      .mockReturnValue(5);

    render(<WorkflowPageDiagnosticsBadge />);

    expect(screen.getByText('5 issues')).toBeInTheDocument();
  });

  it('should not render anything when issues count is undefined', () => {
    jest
      .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
      .mockReturnValue(undefined);

    const { container } = render(<WorkflowPageDiagnosticsBadge />);

    expect(container.firstChild?.firstChild).toBeNull();
  });

  it('should not render anything when there are 0 issues', () => {
    jest
      .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
      .mockReturnValue(0);

    const { container } = render(<WorkflowPageDiagnosticsBadge />);

    expect(container.firstChild?.firstChild).toBeNull();
  });
});
