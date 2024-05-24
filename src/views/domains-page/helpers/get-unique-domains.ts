import { DomainData } from '../domains-page.types';

export default function getUniqueDomains(domains: DomainData[]) {
  const allUniqueDomains: Record<string, boolean> = {};
  return domains.filter((d: DomainData) => {
    if (allUniqueDomains[`${d.id}-${d.name}-${d.activeClusterName}`])
      return false;

    allUniqueDomains[`${d.id}-${d.name}-${d.activeClusterName}`] = true;
    return true;
  });
}
