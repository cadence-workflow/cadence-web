import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

export default function getArchivalErrorPanelProps({
  inputType,
  error,
  queryString,
}: {
  inputType: WorkflowsHeaderInputType;
  error: RequestError;
  queryString: string;
}): ErrorPanelProps {
  if (inputType === 'query') {
    if (!queryString) {
      return {
        message: 'Please enter a valid query with a CloseTime filter',
      };
    }

    if (error.status === 400) {
      return {
        message: 'Error in query: ' + error.message,
      };
    }
  }

  return {
    message: 'Failed to fetch archived workflows',
    actions: [{ kind: 'retry', label: 'Retry' }],
  };
}
