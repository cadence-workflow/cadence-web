import { type DomainPageTabsErrorConfig } from '../domain-page-tabs-error/domain-page-tabs-error.types';

const domainPageTabsErrorConfig: DomainPageTabsErrorConfig = {
  workflows: () => ({
    message: 'Failed to load workflows',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
  metadata: () => ({
    message: 'Failed to load metadata',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
  settings: () => ({
    message: 'Failed to load settings',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
  archival: () => ({
    message: 'Failed to load archival workflows',
    actions: [{ kind: 'retry', label: 'Retry' }],
  }),
} as const;

export default domainPageTabsErrorConfig;
