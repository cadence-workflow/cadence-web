import 'server-only';
import { cache } from 'react';

import getConfigValue from '@/utils/config/get-config-value';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';

import filterIrrelevantDomains from './filter-irrelevant-domains';
import getUniqueDomains from './get-unique-domains';

const MAX_DOMAINS_TO_FETCH = 2000;

export const getAllDomains = async () => {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');
  const results = await Promise.allSettled(
    CLUSTERS_CONFIGS.map(async ({ clusterName }) => {
      const clusterMethods = await grpcClient.getClusterMethods(clusterName);

      return clusterMethods
        .listDomains({ pageSize: MAX_DOMAINS_TO_FETCH })
        .then(
          ({ domains }) => {
            if (domains.length >= MAX_DOMAINS_TO_FETCH - 100) {
              logger.warn(
                {
                  domainsCount: domains.length,
                  maxDomainsCount: MAX_DOMAINS_TO_FETCH,
                },
                'Number of domains in cluster approaching/exceeds max number of domains that can be fetched'
              );
            }
            return filterIrrelevantDomains(clusterName, domains);
          },
          (reason) => {
            logger.error(
              { error: reason, clusterName },
              `Failed to fetch domains for ${clusterName}` +
                (reason instanceof GRPCError ? `: ${reason.message}` : '')
            );
            throw reason;
          }
        );
    })
  );
  return {
    domains: getUniqueDomains(
      results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []))
    ),
    failedClusters: CLUSTERS_CONFIGS.map((config) => ({
      clusterName: config.clusterName,
      rejection: results.find((res) => res.status === 'rejected'),
    }))
      .filter((res) => res.rejection)
      .map((res) => ({
        clusterName: res.clusterName,
        httpStatus:
          res.rejection && 'reason' in res.rejection
            ? res.rejection.reason.httpStatusCode
            : undefined,
      })),
  };
};

export const getCachedAllDomains = cache(getAllDomains);
