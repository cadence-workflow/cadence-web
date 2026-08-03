'use client';
import { useQueries } from '@tanstack/react-query';

import { type DomainsListingFailedCluster } from '../domains-page-error-banner/domains-page-error-banner.types';
import getUniqueDomains from '../helpers/get-unique-domains';

import getDomainsForClusterQueryOptions from './get-domains-for-cluster-query-options';
import { type UseDomainsForClustersResult } from './use-domains-for-clusters.types';

export default function useDomainsForClusters(
  clusterNames: Array<string>
): UseDomainsForClustersResult {
  return useQueries({
    queries: clusterNames.map((clusterName) =>
      getDomainsForClusterQueryOptions(clusterName)
    ),
    combine: (results) => ({
      domains: getUniqueDomains(results.flatMap((result) => result.data ?? [])),
      failedClusters: results.reduce<Array<DomainsListingFailedCluster>>(
        (acc, result, index) => {
          if (result.status === 'error') {
            acc.push({
              clusterName: clusterNames[index],
              httpStatus: result.error.status,
            });
          }
          return acc;
        },
        []
      ),
      isLoading: results.length > 0 && results.every((result) => result.status === 'pending'),
    }),
  });
}
