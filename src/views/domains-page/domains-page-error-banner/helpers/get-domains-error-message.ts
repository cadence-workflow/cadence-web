import { type DomainsListingFailedCluster } from '../domains-page-error-banner.types';

export function getDomainsErrorMessage({
  failedClusters,
}: {
  failedClusters: DomainsListingFailedCluster[];
}): string {
  if (!failedClusters || failedClusters.length === 0) {
    return '';
  }

  const clusterNames = failedClusters
    .map((cluster) => cluster.clusterName)
    .join(', ');

  const allServiceUnavailable = failedClusters.every(
    (cluster) => cluster.httpStatus === 503
  );

  if (allServiceUnavailable) {
    return `Failed to connect to the following clusters: ${clusterNames}`;
  }

  const allApiFailures = failedClusters.every(
    (cluster) => cluster.httpStatus !== 503
  );

  const clusterDetails = failedClusters
    .map((cluster) => `${cluster.clusterName} (${cluster.httpStatus})`)
    .join(', ');

  return `Failed to fetch domains for following clusters: ${allApiFailures ? clusterNames : clusterDetails}`;
}
