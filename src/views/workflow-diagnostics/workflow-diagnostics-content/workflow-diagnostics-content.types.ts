import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

export type Props = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type ViewComponentProps = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  diagnosticsResponse: DiagnoseWorkflowResponse;
};
