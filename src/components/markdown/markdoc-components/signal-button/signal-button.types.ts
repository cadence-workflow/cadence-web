export type SignalButtonProps = {
  signalName: string;
  label: string;
  input?: Record<string, any>;
  fields?: Record<string, string>;
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};
