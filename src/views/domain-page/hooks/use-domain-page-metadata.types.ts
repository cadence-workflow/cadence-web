import { type DomainDescription } from '../domain-page.types';

export type UseDomainPageMetadataParams = {
  domain: string;
  cluster: string;
};

export type DomainMetadata = {
  domainDescription: DomainDescription;
};
