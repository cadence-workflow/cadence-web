import { cache } from 'react';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { unstable_cache } from 'next/cache';
import { DomainData } from '../domains-page.types';
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';

export const getAllDomains = async () => {
  const results = await Promise.all(
    CLUSTERS_CONFIGS.map(({ clusterName }) =>
      grpcClient.clusterMethods[clusterName].listDomains({ pageSize: 1000 })
    )
  );
  const allUniqueDomains: Record<string, DomainData> = {};
  results.forEach((res) => {
    res.domains.forEach((d: DomainData) => {
      allUniqueDomains[`${d.id}-${d.name}-${d.activeClusterName}`] = d;
    });
  });
  return { domains: Object.values(allUniqueDomains) };
};

export const getCachedAllDomains = cache(unstable_cache(
  getAllDomains,
  ['cluster-domains'],
  { revalidate: 60 }
));
