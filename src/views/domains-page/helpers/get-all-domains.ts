import { cache } from 'react';

import { unstable_cache } from 'next/cache';

import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';
import * as grpcClient from '@/utils/grpc/grpc-client';
import logger from '@/utils/logger';

import filterDomainsIrrelevantToCluster from './filter-domains-irrelevant-to-cluster';
import getUniqueDomains from './get-unique-domains';

const MAX_DOMAINS_TO_FETCH = 2000;

export const getAllDomains = async () => {
  const results = await Promise.all(
    CLUSTERS_CONFIGS.map(({ clusterName }) =>
      grpcClient
        .getClusterMethods(clusterName)
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
        })
    )
  );
  return { domains: getUniqueDomains(results.flat(1)) };
};

export const getCachedAllDomains = cache(
  unstable_cache(getAllDomains, ['cluster-domains'], { revalidate: 60 })
);
