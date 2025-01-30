import 'server-only';
import { cache } from 'react';

import getConfigValue from '@/utils/config/get-config-value';
import * as grpcClient from '@/utils/grpc/grpc-client';
import logger from '@/utils/logger';

import filterDomainsIrrelevantToCluster from './filter-domains-irrelevant-to-cluster';
import getUniqueDomains from './get-unique-domains';

const MAX_DOMAINS_TO_FETCH = 2000;

export const getAllDomains = async () => {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');
  const results = await Promise.allSettled(
    CLUSTERS_CONFIGS.map(async ({ clusterName }) => {
      const clusterMethods = await grpcClient.getClusterMethods(clusterName);

      return clusterMethods
        .listDomains({ pageSize: MAX_DOMAINS_TO_FETCH })
        .then(({ domains }) => {
          if (domains.length >= MAX_DOMAINS_TO_FETCH - 100) {
            logger.warn(
              {
                domainsCount: domains.length,
                maxDomainsCount: MAX_DOMAINS_TO_FETCH,
              },
              'Number of domains in cluster approaching/exceeds max number of domains that can be fetched'
            );
          }
          return filterDomainsIrrelevantToCluster(clusterName, domains);
        });
    })
  );
  return {
    domains: getUniqueDomains(
      results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []))
    ),
    failedClusters: CLUSTERS_CONFIGS.map((config) => config.clusterName).filter(
      (_, index) => results[index].status === 'rejected'
    ),
  };
};

export const getCachedAllDomains = cache(getAllDomains);
