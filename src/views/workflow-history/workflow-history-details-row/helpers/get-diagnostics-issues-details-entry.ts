import { type EventDetailsSingleEntry } from '../../workflow-history-event-details/workflow-history-event-details.types';
import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import { DIAGNOSTICS_ISSUES_DETAILS_PATH } from '../workflow-history-details-row.constants';

export default function getDiagnosticsIssuesDetailsEntry(
  diagnosticsIssues: Array<WorkflowDiagnosticsIssue>
): EventDetailsSingleEntry {
  return {
    key: DIAGNOSTICS_ISSUES_DETAILS_PATH,
    path: DIAGNOSTICS_ISSUES_DETAILS_PATH,
    value: diagnosticsIssues,
    isGroup: false,
    renderConfig: null,
  };
}
