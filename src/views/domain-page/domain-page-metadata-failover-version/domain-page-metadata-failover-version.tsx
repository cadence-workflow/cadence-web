import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../domain-page.types';

export default function DomainPageMetadataFailoverVersion(
  domainDescription: DomainDescription
) {
  if (isActiveActiveDomain(domainDescription)) {
    // TODO @adhitya.mamallan: add special rendering for failover versions for different cluster attributes
    return domainDescription.failoverVersion;
  }

  return domainDescription.failoverVersion;
}
