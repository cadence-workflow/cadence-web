import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../domain-page.types';

export default function DomainPageMetadataMode(
  domainDescription: DomainDescription
) {
  if (isActiveActiveDomain(domainDescription)) {
    return 'Active-Active';
  }

  if (domainDescription.isGlobalDomain) {
    return 'Active-Passive';
  }

  return 'Local';
}
