import { render, screen } from '@/test-utils/rtl';

import getDiagnosticsIssuesDetailsEntry from '../../workflow-history-details-row/helpers/get-diagnostics-issues-details-entry';
import getParsedDetailsRowItems from '../../workflow-history-details-row/helpers/get-parsed-details-row-items';
import { type DetailsRowItem } from '../../workflow-history-details-row/workflow-history-details-row.types';
import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';

describe('workflowHistoryDetailsRowParsersConfig diagnostics issues parser', () => {
  it('styles the diagnostics entry as a warning pill with an icon and inverted tooltip', () => {
    const [item] = getParsedDetailsRowItems([
      getDiagnosticsIssuesDetailsEntry(getMockIssues(2)),
    ]);

    expect(item.path).toBe('diagnosticsIssues');
    expect(item.icon).not.toBeNull();
    expect(item.badgeColor).toBe('warning');
    expect(item.invertTooltipColors).toBe(true);
  });

  it('renders "1 issue" for a single issue', () => {
    const [item] = getParsedDetailsRowItems([
      getDiagnosticsIssuesDetailsEntry(getMockIssues(1)),
    ]);

    renderValue(item);

    expect(screen.getByText('1 issue')).toBeInTheDocument();
  });

  it('renders "N issues" for multiple issues', () => {
    const [item] = getParsedDetailsRowItems([
      getDiagnosticsIssuesDetailsEntry(getMockIssues(3)),
    ]);

    renderValue(item);

    expect(screen.getByText('3 issues')).toBeInTheDocument();
  });

  it('renders the issues in the tooltip content', () => {
    const [item] = getParsedDetailsRowItems([
      getDiagnosticsIssuesDetailsEntry(getMockIssues(2)),
    ]);

    render(
      <item.renderTooltip
        label={item.label}
        value={item.value}
        cluster="c"
        domain="d"
        workflowId="w"
        runId="r"
      />
    );

    expect(screen.getByText('Issue 0')).toBeInTheDocument();
    expect(screen.getByText('Issue 1')).toBeInTheDocument();
  });

  it('hides the diagnostics entry when there are no issues', () => {
    expect(
      getParsedDetailsRowItems([getDiagnosticsIssuesDetailsEntry([])])
    ).toEqual([]);
  });
});

function renderValue(item: DetailsRowItem) {
  render(
    <item.renderValue
      label={item.label}
      value={item.value}
      cluster="c"
      domain="d"
      workflowId="w"
      runId="r"
    />
  );
}

function getMockIssues(count: number): Array<WorkflowDiagnosticsIssue> {
  return Array.from({ length: count }, (_, i) => ({
    issueId: i,
    invariantType: `Issue ${i}`,
    reason: `Reason ${i}`,
    metadata: null,
    rootCauses: [],
  }));
}
