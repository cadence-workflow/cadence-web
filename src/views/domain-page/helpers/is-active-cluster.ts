import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../domain-page.types';

export default function isActiveCluster(
  domain: DomainDescription,
  cluster: string
) {
  if (isActiveActiveDomain(domain)) {
    const activeClusters = Object.values(
      domain.activeClusters.regionToCluster
    ).map((activeClusterInfo) => activeClusterInfo.activeClusterName);

    return activeClusters.includes(cluster);
  }

  return cluster === domain.activeClusterName;
}
