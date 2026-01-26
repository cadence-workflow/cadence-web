export type SignalButtonProps = {
  signalName: string;
  label: string;
  input?: Record<string, any>;
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};
