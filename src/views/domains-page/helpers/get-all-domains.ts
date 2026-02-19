import 'server-only';

import getConfigValue from '@/utils/config/get-config-value';

import { type DomainsListingFailedCluster } from '../domains-page-error-banner/domains-page-error-banner.types';

import getDomainsForCluster from './get-domains-for-cluster';
import getUniqueDomains from './get-unique-domains';

const MAX_DOMAINS_TO_FETCH = 2000;

export const getAllDomains = async () => {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');

  const results = await Promise.allSettled(
    CLUSTERS_CONFIGS.map(({ clusterName }) =>
      getDomainsForCluster(clusterName, MAX_DOMAINS_TO_FETCH)
    )
  );

  return {
    domains: getUniqueDomains(
      results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []))
    ),
    failedClusters: results.reduce<DomainsListingFailedCluster[]>(
      (acc, res, index) => {
        if (res.status === 'fulfilled') return acc;

        acc.push({
          clusterName: CLUSTERS_CONFIGS[index].clusterName,
          httpStatus: res.reason?.httpStatusCode ?? undefined,
        });

        return acc;
      },
      []
    ),
  };
};
