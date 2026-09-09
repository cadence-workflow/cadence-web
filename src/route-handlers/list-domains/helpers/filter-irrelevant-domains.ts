import type { Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export default function filterIrrelevantDomains(
  clusterName: string,
  domains: Domain[]
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
