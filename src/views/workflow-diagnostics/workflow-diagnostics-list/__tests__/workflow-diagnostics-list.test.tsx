import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import { type Props as IssueProps } from '../../workflow-diagnostics-issue/workflow-diagnostics-issue.types';
import WorkflowDiagnosticsList from '../workflow-diagnostics-list';
import { type Props } from '../workflow-diagnostics-list.types';

jest.mock('../../workflow-diagnostics-issue/workflow-diagnostics-issue', () => {
  return function MockWorkflowDiagnosticsIssue({
    issue,
    rootCauses,
  }: IssueProps) {
    return (
      <div data-testid="workflow-diagnostics-issue">
        <div data-testid="issue-id">{issue.issueId}</div>
        <div data-testid="issue-type">{issue.invariantType}</div>
        <div data-testid="issue-reason">{issue.reason}</div>
        <div data-testid="root-causes-count">{rootCauses.length}</div>
      </div>
    );
  };
});

describe(WorkflowDiagnosticsList.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all issue groups with correct titles', () => {
    setup({});

    expect(screen.getByText('Failures')).toBeInTheDocument();
    // Timeouts and Retries are null, so they shouldn't be rendered
    expect(screen.queryByText('Timeouts')).not.toBeInTheDocument();
    expect(screen.queryByText('Retries')).not.toBeInTheDocument();
  });

  it('renders all issues within each group', () => {
    setup({});

    const diagnosticIssues = screen.getAllByTestId(
      'workflow-diagnostics-issue'
    );
    expect(diagnosticIssues).toHaveLength(5); // 5 issues from Failures group
  });

  it('passes correct props to WorkflowDiagnosticsIssue components', () => {
    setup({});

    const diagnosticIssues = screen.getAllByTestId(
      'workflow-diagnostics-issue'
    );

    // Check first issue (Activity Failed)
    const firstIssue = diagnosticIssues[0];
    expect(within(firstIssue).getByTestId('issue-id')).toHaveTextContent('0');
    expect(within(firstIssue).getByTestId('issue-type')).toHaveTextContent(
      'Activity Failed'
    );
    expect(within(firstIssue).getByTestId('issue-reason')).toHaveTextContent(
      'The failure is because of an error returned from the service code'
    );
    expect(
      within(firstIssue).getByTestId('root-causes-count')
    ).toHaveTextContent('1');

    // Check second issue (Activity Failed)
    const secondIssue = diagnosticIssues[1];
    expect(within(secondIssue).getByTestId('issue-id')).toHaveTextContent('1');
    expect(within(secondIssue).getByTestId('issue-type')).toHaveTextContent(
      'Activity Failed'
    );
    expect(within(secondIssue).getByTestId('issue-reason')).toHaveTextContent(
      'The failure is because of an error returned from the service code'
    );
    expect(
      within(secondIssue).getByTestId('root-causes-count')
    ).toHaveTextContent('1');

    // Check third issue (Activity Failed)
    const thirdIssue = diagnosticIssues[2];
    expect(within(thirdIssue).getByTestId('issue-id')).toHaveTextContent('2');
    expect(within(thirdIssue).getByTestId('issue-type')).toHaveTextContent(
      'Activity Failed'
    );
    expect(within(thirdIssue).getByTestId('issue-reason')).toHaveTextContent(
      'The failure is because of an error returned from the service code'
    );
    expect(
      within(thirdIssue).getByTestId('root-causes-count')
    ).toHaveTextContent('1');
  });

  it('filters root causes correctly for each issue', () => {
    setup({});

    const diagnosticIssues = screen.getAllByTestId(
      'workflow-diagnostics-issue'
    );

    // Each issue should have exactly one root cause
    diagnosticIssues.forEach((issue) => {
      const rootCausesCount = within(issue).getByTestId('root-causes-count');
      expect(rootCausesCount).toHaveTextContent('1');
    });
  });

  it('handles empty diagnostics result', () => {
    setup({
      diagnosticsResult: {
        result: {},
        completed: true,
      },
    });

    // Should render the container but no issue groups
    expect(
      screen.queryByTestId('workflow-diagnostics-issue')
    ).not.toBeInTheDocument();
  });

  it('hides issues groups with no issues', () => {
    setup({
      diagnosticsResult: {
        result: {
          ...mockWorkflowDiagnosticsResult.result,
          'Empty Issues Group': {
            issues: [],
            rootCauses: [],
            runbook: '',
          },
        },
        completed: true,
      },
    });

    expect(screen.getByText('Failures')).toBeInTheDocument();
    expect(screen.queryByText('Empty Issues Group')).not.toBeInTheDocument();
  });
});

function setup(overrides: Partial<Props>) {
  const mockProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    diagnosticsResult: mockWorkflowDiagnosticsResult,
    ...overrides,
  };

  render(<WorkflowDiagnosticsList {...mockProps} />);
}
