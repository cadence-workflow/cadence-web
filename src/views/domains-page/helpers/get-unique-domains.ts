import getDefaultClusterForActiveActiveDomain from '@/views/shared/active-active/helpers/get-default-cluster-for-active-active-domain';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainData } from '../domains-page.types';

export default function getUniqueDomains(domains: DomainData[]) {
  const allUniqueDomains: Record<string, boolean> = {};
  return domains.filter((d: DomainData) => {
    const defaultCluster = isActiveActiveDomain(d)
      ? getDefaultClusterForActiveActiveDomain(d)
      : d.activeClusterName;

    if (allUniqueDomains[`${d.id}-${d.name}-${defaultCluster}`]) return false;

    allUniqueDomains[`${d.id}-${d.name}-${defaultCluster}`] = true;
    return true;
  });
}
