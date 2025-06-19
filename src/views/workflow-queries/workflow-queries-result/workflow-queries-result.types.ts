import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type Props = {
  data?: QueryWorkflowResponse;
  error?: RequestError;
  loading?: boolean;
};

export type QueryContentTypes = 'json' | 'markdown';

export type QueryJsonContent = {
  contentType: QueryContentTypes;
  isError: boolean;
} & (
  | {
      contentType: 'json';
      content: PrettyJsonValue;
    }
  | {
      contentType: 'markdown';
      content: string;
    }
);
