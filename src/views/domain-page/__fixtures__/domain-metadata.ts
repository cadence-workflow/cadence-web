import { type DomainMetadata } from '../domain-page-metadata/domain-page-metadata.types';

import { mockDomainDescription } from './domain-description';

export const mockDomainMetadata = {
  domainDescription: mockDomainDescription,
  isExtendedMetadataEnabled: false,
} as const satisfies DomainMetadata;
