import type { DomainData } from '../domains-page.types';

export default function filterIrrelevantDomains(
  clusterName: string,
  domains: DomainData[]
) {
  return (domains || []).filter((domain) => {
    if (
      domain.status === 'DOMAIN_STATUS_INVALID' ||
      domain.status === 'DOMAIN_STATUS_DELETED'
    )
      return false;

    if (!domain.clusters.some(({ clusterName: c }) => clusterName === c))
      return false;

    return true;
  });
}
