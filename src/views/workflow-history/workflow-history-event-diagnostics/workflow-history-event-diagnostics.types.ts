import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

export type Props = {
  issues: Array<WorkflowDiagnosticsIssue>;
  getIsIssueExpanded: (issueExpansionId: string) => boolean;
  toggleIsIssueExpanded: (issueExpansionId: string) => void;
} & WorkflowPageParams;
