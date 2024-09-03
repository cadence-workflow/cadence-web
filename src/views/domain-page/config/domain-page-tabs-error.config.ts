import getDomainWorkflowsErrorConfig from '@/views/domain-workflows/helpers/get-domain-workflows-error-config';

import { type DomainPageTabsErrorConfig } from '../domain-page-tabs-error/domain-page-tabs-error.types';

const domainPageTabsErrorConfig: DomainPageTabsErrorConfig = {
  workflows: getDomainWorkflowsErrorConfig,
  metadata: () => ({
    message: 'Failed to load metadata',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
  settings: () => ({
    message: 'Failed to load settings',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
} as const;

export default domainPageTabsErrorConfig;
