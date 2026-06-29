export type UseEditBatchActionRpsParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  onSuccess?: () => void;
};

export type EditBatchActionRpsInput = {
  rps: number;
};

export type UseEditBatchActionRpsResult = {
  editRps: (rps: number) => void;
  isPending: boolean;
};
