import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

export type Props = {
  issues: Array<WorkflowDiagnosticsIssue>;
  getIsIssueExpanded: (issueExpansionId: string) => boolean;
  toggleIsIssueExpanded: (issueExpansionId: string) => void;
};
