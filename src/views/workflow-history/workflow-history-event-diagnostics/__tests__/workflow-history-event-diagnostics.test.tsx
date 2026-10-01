import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryEventDiagnostics from '../workflow-history-event-diagnostics';
import { type Props } from '../workflow-history-event-diagnostics.types';

jest.mock(
  '../../workflow-history-event-diagnostics-table/workflow-history-event-diagnostics-table',
  () =>
    jest.fn(({ metadata }) => (
      <div data-testid="metadata-table">
        <span>{JSON.stringify(metadata)}</span>
      </div>
    ))
);

const defaultIssues: Props['issues'] = [
  {
    issueId: 0,
    invariantType: 'Activity Failed',
    reason: 'Activity timed out after 30 seconds',
    metadata: {},
    runbook: 'https://example.com/runbook',
    rootCauses: [],
  },
  {
    issueId: 1,
    invariantType: 'Decision Failed',
    reason: 'Decision task failed with error',
    metadata: {},
    rootCauses: [],
  },
];

describe('WorkflowHistoryEventDiagnostics', () => {
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

  it('passes issue metadata and issue ID to the metadata table without root causes', () => {
    setup({
      issues: [
        {
          ...defaultIssues[0],
          metadata: { ActivityScheduledID: 5 },
        },
      ],
      getIsIssueExpanded: jest.fn(() => true),
    });

    expect(
      screen.getByText(JSON.stringify({ ActivityScheduledID: 5, issueId: 0 }))
    ).toBeInTheDocument();
  });

  it('passes a single root cause under the Root Cause key', () => {
    const rootCauses = [
      {
        issueId: 0,
        rootCauseType: 'Activity Timeout',
        metadata: { ExpectedTimeout: 30 },
      },
    ];
    setup({
      issues: [
        {
          ...defaultIssues[0],
          metadata: { ActivityScheduledID: 5 },
          rootCauses,
        },
      ],
      getIsIssueExpanded: jest.fn(() => true),
    });

    expect(
      screen.getByText(
        JSON.stringify({
          ActivityScheduledID: 5,
          issueId: 0,
          'Root Cause': rootCauses,
        })
      )
    ).toBeInTheDocument();
  });

  it('passes multiple root causes under the Root Causes key', () => {
    const rootCauses = [
      { issueId: 0, rootCauseType: 'Activity Timeout', metadata: {} },
      { issueId: 0, rootCauseType: 'Worker Unavailable', metadata: {} },
    ];
    setup({
      issues: [{ ...defaultIssues[0], rootCauses }],
      getIsIssueExpanded: jest.fn(() => true),
    });

    expect(
      screen.getByText(
        JSON.stringify({ issueId: 0, 'Root Causes': rootCauses })
      )
    ).toBeInTheDocument();
  });

  it('hides metadata table when issue is collapsed', () => {
    setup({
      issues: [defaultIssues[0]],
      getIsIssueExpanded: jest.fn(() => false),
    });

    expect(screen.queryByTestId('metadata-table')).not.toBeInTheDocument();
  });
});

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
    />
  );

  return {
    user,
    mockGetIsIssueExpanded,
    mockToggleIsIssueExpanded,
  };
}
