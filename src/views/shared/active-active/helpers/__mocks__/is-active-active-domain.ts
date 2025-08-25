import { type DomainData } from '@/views/domains-page/domains-page.types';

// Manual mock for isActiveActiveDomain
export default function isActiveActiveDomain(domain: DomainData) {
  return Boolean(
    domain.activeClusters?.regionToCluster &&
      Object.entries(domain.activeClusters.regionToCluster).length > 0
  );
}
