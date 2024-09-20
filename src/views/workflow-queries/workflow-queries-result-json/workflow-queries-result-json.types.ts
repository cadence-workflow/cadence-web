import { type JsonValue } from '@/components/pretty-json/pretty-json.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type Props = {
  data?: QueryWorkflowResponse;
  error?: RequestError;
  loading?: boolean;
};

export type QueryJsonContent = {
  content: JsonValue | undefined;
  isError: boolean;
};
