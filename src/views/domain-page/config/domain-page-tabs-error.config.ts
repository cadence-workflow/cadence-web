import { type DomainPageTabsErrorConfig } from '../domain-page-tabs-error/domain-page-tabs-error.types';
import getDomainWorkflowsErrorConfig from '../helpers/get-domain-workflows-error-config';

const domainPageTabsErrorConfig = {
  workflows: getDomainWorkflowsErrorConfig,
  metadata: () => ({
    message: 'Failed to load metadata',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
  settings: () => ({
    message: 'Failed to load settings',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
} as const satisfies DomainPageTabsErrorConfig;

export default domainPageTabsErrorConfig;
