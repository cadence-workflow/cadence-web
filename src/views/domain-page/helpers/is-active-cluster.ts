import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../domain-page.types';

export default function isActiveCluster(
  domain: DomainDescription,
  cluster: string
) {
  if (isActiveActiveDomain(domain)) {
    return (
      Object.values(domain.activeClusters.regionToCluster).find(
        (activeClusterInfo) => activeClusterInfo.activeClusterName === cluster
      ) !== undefined
    );
  }

  return cluster === domain.activeClusterName;
}
