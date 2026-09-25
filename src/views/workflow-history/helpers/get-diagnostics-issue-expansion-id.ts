import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

export default function getDiagnosticsIssueExpansionId(
  issue: Pick<WorkflowDiagnosticsIssue, 'invariantType' | 'issueId'>
): string {
  return `${issue.invariantType}.${issue.issueId}`;
}
