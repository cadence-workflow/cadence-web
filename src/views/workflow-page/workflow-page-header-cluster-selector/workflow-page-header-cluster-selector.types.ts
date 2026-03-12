export type Props = {
  domain: string;
  cluster: string;
};

export type BuildWorkflowPageClusterPathParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  workflowTab?: string;
};
