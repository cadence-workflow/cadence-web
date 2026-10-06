import { type WorkflowDiagnosticsIssue } from '../../../workflow-history.types';
import { DIAGNOSTICS_ISSUES_DETAILS_PATH } from '../../workflow-history-details-row.constants';
import getDiagnosticsIssuesDetailsEntry from '../get-diagnostics-issues-details-entry';

describe(getDiagnosticsIssuesDetailsEntry.name, () => {
  it('returns a single entry at the diagnostics path with the issues as value', () => {
    const issues: Array<WorkflowDiagnosticsIssue> = [
      {
        issueId: 1,
        invariantType: 'Activity Failed',
        reason: 'The activity returned an error',
        metadata: null,
        rootCauses: [],
      },
    ];

    expect(getDiagnosticsIssuesDetailsEntry(issues)).toEqual({
      key: DIAGNOSTICS_ISSUES_DETAILS_PATH,
      path: DIAGNOSTICS_ISSUES_DETAILS_PATH,
      value: issues,
      isGroup: false,
      renderConfig: null,
    });
  });
});
