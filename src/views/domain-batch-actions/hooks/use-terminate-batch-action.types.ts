export type UseTerminateBatchActionParams = {
  cluster: string;
  workflowId: string;
  onSuccess?: () => void;
};

export type UseTerminateBatchActionResult = {
  terminate: (runId: string) => void;
  isTerminating: boolean;
};
