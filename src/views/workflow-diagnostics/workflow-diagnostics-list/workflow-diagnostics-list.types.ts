import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type IssueExpansionID } from '../workflow-diagnostics-content/workflow-diagnostics-content.types';
import { type DiagnosticsIssuesGroup } from '../workflow-diagnostics.types';

export type Props = {
  diagnosticsIssuesGroups: Array<[string, DiagnosticsIssuesGroup]>;
  getIsIssueExpanded: (issueExpansionId: IssueExpansionID) => boolean;
  toggleIsIssueExpanded: (issueExpansionId: IssueExpansionID) => void;
} & WorkflowPageParams;
