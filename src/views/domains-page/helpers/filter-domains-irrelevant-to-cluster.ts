import type { DomainData } from '../domains-page.types';

export default function filterDomainsIrrelevantToCluster(
  clusterName: string,
  domains: Pick<DomainData, 'clusters'>[]
) {
  return (domains || []).filter(({ clusters }) =>
    clusters.some(({ clusterName: c }) => clusterName === c)
  );
}
