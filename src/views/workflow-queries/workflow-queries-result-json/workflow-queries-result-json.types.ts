import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type Props = {
  data?: QueryWorkflowResponse;
  error?: RequestError;
  loading?: boolean;
};

export type Markdown = {
  type: 'markdown';
  content: string;
};

export type QueryJsonContent = {
  content: PrettyJsonValue | Markdown | undefined;
  isError: boolean;
};
