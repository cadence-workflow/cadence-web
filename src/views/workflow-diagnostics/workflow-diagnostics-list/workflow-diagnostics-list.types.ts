import { type WorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

export type Props = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  diagnosticsResult: WorkflowDiagnosticsResult;
};
