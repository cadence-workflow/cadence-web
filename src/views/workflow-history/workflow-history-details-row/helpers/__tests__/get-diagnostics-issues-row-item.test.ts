import WorkflowHistoryDetailsRowDiagnosticsTooltip from '../../../workflow-history-details-row-diagnostics-tooltip/workflow-history-details-row-diagnostics-tooltip';
import { type WorkflowDiagnosticsIssue } from '../../../workflow-history.types';
import getDiagnosticsIssuesRowItem from '../get-diagnostics-issues-row-item';

jest.mock(
  '../../../workflow-history-details-row-diagnostics-tooltip/workflow-history-details-row-diagnostics-tooltip',
  () => jest.fn()
);

describe(getDiagnosticsIssuesRowItem.name, () => {
  it('returns a warning row item with the issues as its value', () => {
    const diagnosticsIssues = getMockIssues(1);

    const result = getDiagnosticsIssuesRowItem(diagnosticsIssues);

    expect(result).toMatchObject({
      path: 'diagnosticsIssues',
      value: diagnosticsIssues,
      renderTooltip: WorkflowHistoryDetailsRowDiagnosticsTooltip,
      invertTooltipColors: true,
      badgeColor: 'warning',
    });
    expect(result.icon).not.toBeNull();
  });
});

function getMockIssues(count: number): Array<WorkflowDiagnosticsIssue> {
  return Array.from({ length: count }, (_, i) => ({
    issueId: i,
    invariantType: 'Activity Failed',
    reason: 'The activity returned an error',
    metadata: null,
  }));
}
