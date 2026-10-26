export type StartWorkflowButtonProps = {
  workflowType: string;
  label: string;
  domain?: string;
  cluster?: string;
  taskList: string;
  wfId?: string;
  input?: Record<string, any>;
  fields?: Record<string, string>;
  memo?: Record<string, unknown>;
  timeoutSeconds?: number;
  sdkLanguage?: string;
};
