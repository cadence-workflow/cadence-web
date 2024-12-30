import DomainWorkflows from '@/views/domain-workflows/domain-workflows';
import DomainWorkflowsArchival from '@/views/domain-workflows-archival/domain-workflows-archival';

import type { DomainPageTabsContentConfig } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadata from '../domain-page-metadata/domain-page-metadata';
import DomainPageSettings from '../domain-page-settings/domain-page-settings';

const domainPageTabsContentConfig = {
  workflows: DomainWorkflows,
  metadata: DomainPageMetadata,
  settings: DomainPageSettings,
  archival: DomainWorkflowsArchival,
} as const satisfies DomainPageTabsContentConfig;

export default domainPageTabsContentConfig;
