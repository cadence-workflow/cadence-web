import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import * as useConfigValueModule from '@/hooks/use-config-value/use-config-value';
import * as useWorkflowDiagnosticsIssuesCountModule from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import WorkflowSummaryDiagnosticsBanner from '../workflow-summary-diagnostics-banner';

// TODO: remove with old diagnostics view. Direct mock keeps these tests sync, reducing code to clean up.
jest.mock('@/hooks/use-config-value/use-config-value', () =>
  jest.fn(() => ({ data: false }))
);

jest.mock('@/views/shared/hooks/use-workflow-diagnostics-issues-count', () =>
  jest.fn(() => undefined)
);

describe(WorkflowSummaryDiagnosticsBanner.name, () => {
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

  it('should render View history when diagnostics in history is enabled', () => {
    setup({
      mockIssuesCount: 1,
      isWorkflowDiagnosticsInHistoryEnabled: true,
    });

    expect(
      screen.getByText('1 issue was detected on this workflow')
    ).toBeInTheDocument();
    expect(screen.getByText('View history')).toBeInTheDocument();
    expect(screen.queryByText('View issue')).not.toBeInTheDocument();
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

  it('should render link to history page when diagnostics in history is enabled', () => {
    setup({
      mockIssuesCount: 3,
      isWorkflowDiagnosticsInHistoryEnabled: true,
    });

    const link = screen.getByRole('link', { name: 'View history' });
    expect(link).toHaveAttribute(
      'href',
      '/domains/mock-domain/cluster_1/workflows/mock-workflow-id/mock-run-id/history'
    );
  });
});

function setup({
  mockIssuesCount,
  isWorkflowDiagnosticsInHistoryEnabled = false,
}: {
  mockIssuesCount?: number;
  isWorkflowDiagnosticsInHistoryEnabled?: boolean;
}) {
  jest
    .spyOn(useWorkflowDiagnosticsIssuesCountModule, 'default')
    .mockReturnValue(mockIssuesCount);

  jest.spyOn(useConfigValueModule, 'default').mockReturnValue({
    data: isWorkflowDiagnosticsInHistoryEnabled,
  } as ReturnType<typeof useConfigValueModule.default>);

  const result = render(
    <WorkflowSummaryDiagnosticsBanner
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
