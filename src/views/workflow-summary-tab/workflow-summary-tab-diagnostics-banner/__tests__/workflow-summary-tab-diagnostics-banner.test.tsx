import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import * as useWorkflowDiagnosticsIssuesCountModule from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import WorkflowSummaryTabDiagnosticsBanner from '../workflow-summary-tab-diagnostics-banner';

jest.mock('@/views/shared/hooks/use-workflow-diagnostics-issues-count', () =>
  jest.fn(() => undefined)
);

describe(WorkflowSummaryTabDiagnosticsBanner.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render banner with singular issue text when count is 1', () => {
    setup({ mockIssuesCount: 1 });

    expect(
      screen.getByText('1 issue was detected on this workflow')
    ).toBeInTheDocument();
    expect(screen.getByText('View issue')).toBeInTheDocument();
  });

  it('should render banner with plural issues text when count is greater than 1', () => {
    setup({ mockIssuesCount: 5 });

    expect(
      screen.getByText('5 issues were detected on this workflow')
    ).toBeInTheDocument();
    expect(screen.getByText('View issues')).toBeInTheDocument();
  });

  it('should not render anything when issues count is undefined', () => {
    const { container } = setup({ mockIssuesCount: undefined });

    expect(container.firstChild?.firstChild).toBeNull();
  });

  it('should not render anything when there are 0 issues', () => {
    const { container } = setup({ mockIssuesCount: 0 });

    expect(container.firstChild?.firstChild).toBeNull();
  });

  it('should render link to diagnostics page with correct href', () => {
    setup({ mockIssuesCount: 3 });

    const link = screen.getByRole('link', { name: 'View issues' });
    expect(link).toHaveAttribute(
      'href',
      '/domains/mock-domain/cluster_1/workflows/mock-workflow-id/mock-run-id/diagnostics'
    );
  });
});

function setup({ mockIssuesCount }: { mockIssuesCount?: number }) {
  jest
    .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
    .mockReturnValue(mockIssuesCount);

  const result = render(
    <WorkflowSummaryTabDiagnosticsBanner
      domain="mock-domain"
      cluster="cluster_1"
      workflowId="mock-workflow-id"
      runId="mock-run-id"
    />
  );

  return {
    ...result,
  };
}
