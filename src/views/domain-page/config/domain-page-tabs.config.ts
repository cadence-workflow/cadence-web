import { MdArchive, MdListAlt, MdSettings, MdSort } from 'react-icons/md';

import DomainWorkflows from '@/views/domain-workflows/domain-workflows';
import DomainWorkflowsArchival from '@/views/domain-workflows-archival/domain-workflows-archival';

import DomainPageMetadata from '../domain-page-metadata/domain-page-metadata';
import DomainPageSettings from '../domain-page-settings/domain-page-settings';
import type { DomainPageTabsConfig } from '../domain-page-tabs/domain-page-tabs.types';

const domainPageTabsConfig: DomainPageTabsConfig<
  'workflows' | 'metadata' | 'settings' | 'archival'
> = {
  workflows: {
    title: 'Workflows',
    artwork: MdSort,
    content: DomainWorkflows,
    getErrorConfig: () => ({
      message: 'Failed to load workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    }),
  },
  metadata: {
    title: 'Metadata',
    artwork: MdListAlt,
    content: DomainPageMetadata,
    getErrorConfig: () => ({
      message: 'Failed to load metadata',
      actions: [{ kind: 'retry', label: 'Retry' }],
    }),
  },
  settings: {
    title: 'Settings',
    artwork: MdSettings,
    content: DomainPageSettings,
    getErrorConfig: () => ({
      message: 'Failed to load settings',
      actions: [{ kind: 'retry', label: 'Retry' }],
    }),
  },
  archival: {
    title: 'Archival',
    artwork: MdArchive,
    content: DomainWorkflowsArchival,
    getErrorConfig: () => ({
      message: 'Failed to load archival workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    }),
  },
} as const;

export default domainPageTabsConfig;
