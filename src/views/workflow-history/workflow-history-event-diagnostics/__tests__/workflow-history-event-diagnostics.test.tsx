import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryEventDiagnostics from '../workflow-history-event-diagnostics';
import { type Props } from '../workflow-history-event-diagnostics.types';

jest.mock(
  '@/views/workflow-diagnostics/workflow-diagnostics-metadata-table/workflow-diagnostics-metadata-table',
  () => jest.fn(() => <div data-testid="metadata-table">Metadata Table</div>)
);

const mockWorkflowPageParams = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  workflowId: 'test-workflow-id',
  runId: 'test-run-id',
};

describe('WorkflowHistoryEventDiagnostics', () => {
  const defaultIssues: Props['issues'] = [
    {
      issueId: 0,
      invariantType: 'Activity Failed',
      reason: 'Activity timed out after 30 seconds',
      metadata: {},
      runbook: 'https://example.com/runbook',
    },
    {
      issueId: 1,
      invariantType: 'Decision Failed',
      reason: 'Decision task failed with error',
      metadata: {},
    },
  ];

  function setup({
    issues = defaultIssues,
    getIsIssueExpanded = jest.fn(() => false),
    toggleIsIssueExpanded = jest.fn(),
  }: Partial<Props> = {}) {
    const user = userEvent.setup();
    const mockGetIsIssueExpanded = getIsIssueExpanded;
    const mockToggleIsIssueExpanded = toggleIsIssueExpanded;

    render(
      <WorkflowHistoryEventDiagnostics
        issues={issues}
        getIsIssueExpanded={mockGetIsIssueExpanded}
        toggleIsIssueExpanded={mockToggleIsIssueExpanded}
        {...mockWorkflowPageParams}
      />
    );

    return { user, mockGetIsIssueExpanded, mockToggleIsIssueExpanded };
  }

  it('renders null when issues array is empty', () => {
    setup({ issues: [] });
    expect(screen.queryByText('Activity Failed')).not.toBeInTheDocument();
    expect(screen.queryByText('Decision Failed')).not.toBeInTheDocument();
  });

  it('renders all issues with their invariant types and reasons', () => {
    setup({});

    expect(screen.getByText('Activity Failed')).toBeInTheDocument();
    expect(
      screen.getByText('Activity timed out after 30 seconds')
    ).toBeInTheDocument();
    expect(screen.getByText('Decision Failed')).toBeInTheDocument();
    expect(
      screen.getByText('Decision task failed with error')
    ).toBeInTheDocument();
  });

  it('renders runbook link when issue has runbook', () => {
    setup({});

    const runbookLink = screen.getByRole('link', { name: /Runbook/ });
    expect(runbookLink).toHaveAttribute('href', 'https://example.com/runbook');
    expect(runbookLink).toHaveAttribute('target', '_blank');
  });

  it('does not render runbook link when issue has no runbook', () => {
    setup({
      issues: [defaultIssues[1]], // Decision Failed has no runbook
    });

    expect(
      screen.queryByRole('link', { name: /Runbook/ })
    ).not.toBeInTheDocument();
  });

  it('calls toggleIsIssueExpanded with composite ID when Details button is clicked', async () => {
    const { user, mockToggleIsIssueExpanded } = setup({});

    const detailsButtons = screen.getAllByText('Details');
    await user.click(detailsButtons[0]);

    expect(mockToggleIsIssueExpanded).toHaveBeenCalledWith('Activity Failed.0');
  });

  it('shows metadata table when issue is expanded', () => {
    setup({
      issues: [defaultIssues[0]],
      getIsIssueExpanded: jest.fn((id: string) => id === 'Activity Failed.0'),
    });

    expect(screen.getByTestId('metadata-table')).toBeInTheDocument();
  });

  it('hides metadata table when issue is collapsed', () => {
    setup({
      issues: [defaultIssues[0]],
      getIsIssueExpanded: jest.fn(() => false),
    });

    expect(screen.queryByTestId('metadata-table')).not.toBeInTheDocument();
  });
});
