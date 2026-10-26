export type SignalButtonProps = {
  signalName: string;
  label: string;
  input?: Record<string, any>;
  variableNames?: string[];
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};
