export type StartWorkflowButtonProps = {
  workflowType: string;
  label: string;
  domain?: string;
  cluster?: string;
  taskList: string;
  wfId?: string;
  input?: Record<string, any>;
  variableNames?: string[];
  timeoutSeconds?: number;
  sdkLanguage?: string;
};
