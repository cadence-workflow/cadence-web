import { type DomainDescription } from '../domain-page.types';

export type UseSuspenseDomainPageMetadataParams = {
  domain: string;
  cluster: string;
};

export type DomainMetadata = {
  domainDescription: DomainDescription;
  isExtendedMetadataEnabled: boolean;
};
