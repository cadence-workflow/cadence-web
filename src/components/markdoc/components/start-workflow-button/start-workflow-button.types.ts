export type StartWorkflowButtonProps = {
  workflowType: string;
  label: string;
  domain: string;
  cluster: string;
  taskList: string;
  wfId?: string;
  input?: Record<string, any>;
  timeoutSeconds?: number;
  sdkLanguage?: string;
};
