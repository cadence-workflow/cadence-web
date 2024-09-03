import DomainWorkflows from '@/views/domain-workflows/domain-workflows';

import type { DomainPageTabsContentConfig } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadata from '../domain-page-metadata/domain-page-metadata';
import DomainPageSettings from '../domain-page-settings/domain-page-settings';

const domainPageTabsContentConfig = {
  workflows: DomainWorkflows,
  metadata: DomainPageMetadata,
  settings: DomainPageSettings,
} as const satisfies DomainPageTabsContentConfig;

export default domainPageTabsContentConfig;
