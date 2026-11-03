import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseWorkflowPayloadsParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type UseWorkflowPayloadsReturn = {
  input: PrettyJsonValue;
  result: PrettyJsonValue;
  searchAttributes: Record<string, PrettyJsonValue> | undefined;
  isRunning: boolean;
  isArchived: boolean;
  isLoading: boolean;
  error: RequestError | null;
};
