import { type DomainPageTabErrorConfig } from '@/views/domain-page/domain-page-tabs-error/domain-page-tabs-error.types';

import { NO_WORKFLOWS_ERROR_MESSAGE } from '../domain-workflows-table/domain-workflows-table.constants';

export default function getDomainWorkflowsErrorConfig(
  err: Error
): DomainPageTabErrorConfig {
  if (err.message === NO_WORKFLOWS_ERROR_MESSAGE) {
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

  return {
    message: 'Failed to load workflows',
    actions: [{ kind: 'retry', label: 'Retry' }],
  };
}
