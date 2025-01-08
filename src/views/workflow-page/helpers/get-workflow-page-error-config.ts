import { RequestError } from '@/utils/request/request-error';
import { type DomainPageTabErrorConfig } from '@/views/domain-page/domain-page-tabs-error/domain-page-tabs-error.types';

export default function getWorkflowPageErrorConfig(
  err: Error,
  defaultErrorMessage: string = 'Failed to load workflow',
  fetchedContentLabel: string = 'workflow'
): DomainPageTabErrorConfig {
  if (err instanceof RequestError && err.status === 403) {
    return {
      message: `Access denied, can't load ${fetchedContentLabel}`,
      actions: [{ kind: 'retry', label: 'Retry' }],
      omitLogging: true,
    };
  }

  if (err instanceof RequestError && err.status === 404) {
    return {
      message: 'Workflow not found',
      actions: [{ kind: 'retry', label: 'Retry' }],
      omitLogging: true,
    };
  }

  return {
    message: defaultErrorMessage,
    actions: [{ kind: 'retry', label: 'Retry' }],
  };
}
