import { type WorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type Props = {
  diagnosticsResult: WorkflowDiagnosticsResult;
} & WorkflowPageParams;

export type IssueExpansionID = `${string}.${number}`;
