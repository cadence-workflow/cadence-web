import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

export default function getArchivalErrorPanelProps({
  inputType,
  error,
}: {
  inputType: WorkflowsHeaderInputType;
  error: RequestError;
}): ErrorPanelProps {
  if (inputType === 'query' && error.status === 400) {
    return {
      message: 'Error in query: ' + error.message,
    };
  }

  return {
    message: 'Failed to fetch archived workflows',
    actions: [{ kind: 'retry', label: 'Retry' }],
  };
}
