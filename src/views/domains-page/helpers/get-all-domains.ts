import { cache } from 'react';

import { unstable_cache } from 'next/cache';

import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';
import * as grpcClient from '@/utils/grpc/grpc-client';

import { type DomainData } from '../domains-page.types';

import filterDomainsIrrelevantToCluster from './filter-domains-irrelevant-to-cluster';
import getUniqueDomains from './get-unique-domains';

export const getAllDomains = async () => {
  const results = await Promise.all(
    CLUSTERS_CONFIGS.map(({ clusterName }) =>
      grpcClient.clusterMethods[clusterName]
        .listDomains({ pageSize: 1000 })
        .then(({ domains }: { domains: DomainData[] }) => {
          return filterDomainsIrrelevantToCluster(clusterName, domains);
        })
    )
  );
  return { domains: getUniqueDomains(results.flat(1)) };
};

export const getCachedAllDomains = cache(
  unstable_cache(getAllDomains, ['cluster-domains'], { revalidate: 60 })
);
