import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseWorkflowInputResultParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type UseWorkflowInputResultReturn = {
  input: PrettyJsonValue;
  result: PrettyJsonValue;
  searchAttributes: Record<string, PrettyJsonValue> | undefined;
  isRunning: boolean;
  isArchived: boolean;
  isLoading: boolean;
  error: RequestError | null;
};
