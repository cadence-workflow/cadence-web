import { type Block } from '@/components/blocks/blocks.types';
import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type Props = {
  data?: QueryWorkflowResponse;
  error?: RequestError;
  loading?: boolean;
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type QueryContentTypes = 'json' | 'markdown' | 'blocks';

export type GetQueryContentArgs = Pick<Props, 'data' | 'error' | 'loading'>;

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
  | {
      contentType: 'blocks';
      content: Block[];
    }
);
