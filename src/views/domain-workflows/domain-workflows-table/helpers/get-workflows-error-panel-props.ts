import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type RequestError } from '@/utils/request/request-error';

import { type DomainWorkflowsHeaderInputType } from '../../domain-workflows-header/domain-workflows-header.types';

export default function getWorkflowsErrorPanelProps({
  inputType,
  error,
  areSearchParamsAbsent,
}: {
  inputType: DomainWorkflowsHeaderInputType;
  error: RequestError | null;
  areSearchParamsAbsent: boolean;
}): ErrorPanelProps | undefined {
  if (error) {
    if (inputType === 'query' && error.status === 400) {
      return {
        message: 'Error in query: ' + error.message,
      };
    }

    return {
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    };
  }

  if (areSearchParamsAbsent) {
    return {
      message: 'No workflows found for this domain',
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
      omitLogging: true,
    };
  }

  return undefined;
}
