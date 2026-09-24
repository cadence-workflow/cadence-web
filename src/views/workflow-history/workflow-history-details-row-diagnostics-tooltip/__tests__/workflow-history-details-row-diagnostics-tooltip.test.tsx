import { render, screen } from '@/test-utils/rtl';

import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import WorkflowHistoryDetailsRowDiagnosticsTooltip from '../workflow-history-details-row-diagnostics-tooltip';

const mockIssues: Array<WorkflowDiagnosticsIssue> = [
  {
    issueId: 1,
    invariantType: 'Activity Failed',
    reason: 'The activity returned an error',
    metadata: null,
  },
  {
    issueId: 2,
    invariantType: 'Decision Timed Out',
    reason: 'The decision task timed out',
    metadata: null,
  },
];

describe(WorkflowHistoryDetailsRowDiagnosticsTooltip.name, () => {
  it('renders the type and reason of each issue', () => {
    render(
      <WorkflowHistoryDetailsRowDiagnosticsTooltip
        label="Diagnostics issues"
        value={mockIssues}
        domain="test-domain"
        cluster="test-cluster"
        workflowId="test-workflow-id"
        runId="test-run-id"
      />
    );

    expect(screen.getByText('Activity Failed')).toBeInTheDocument();
    expect(
      screen.getByText('The activity returned an error')
    ).toBeInTheDocument();
    expect(screen.getByText('Decision Timed Out')).toBeInTheDocument();
    expect(screen.getByText('The decision task timed out')).toBeInTheDocument();
  });
});
