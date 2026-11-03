import { type RequestError } from '@/utils/request/request-error';

export type UseWorkflowPayloadsParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type UseWorkflowPayloadsReturn = {
  input: unknown;
  result: unknown;
  searchAttributes: Record<string, unknown> | undefined;
  isRunning: boolean;
  isArchived: boolean;
  isLoading: boolean;
  error: RequestError | null;
};
