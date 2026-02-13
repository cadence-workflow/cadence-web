import 'server-only';
// cache is not present in stable React 18's type definitions
// It is available only in their canary, or with Next.js
// eslint-disable-next-line import/named
import { cache } from 'react';

import {
  getDomainAccessForUser,
  getGrpcMetadataFromAuth,
  type UserAuthContext,
} from '@/utils/auth/auth-context';
import getConfigValue from '@/utils/config/get-config-value';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';

import filterIrrelevantDomains from './filter-irrelevant-domains';
import getUniqueDomains from './get-unique-domains';

const MAX_DOMAINS_TO_FETCH = 2000;

export const getAllDomains = async (authContext: UserAuthContext) => {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');
  const results = await Promise.allSettled(
    CLUSTERS_CONFIGS.map(async ({ clusterName }) => {
      const clusterMethods = await grpcClient.getClusterMethods(
        clusterName,
        getGrpcMetadataFromAuth(authContext)
      );

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

  const uniqueDomains = getUniqueDomains(
    results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []))
  );

  return {
    domains: uniqueDomains.filter(
      (domain) => getDomainAccessForUser(domain, authContext).canRead
    ),
    failedClusters: CLUSTERS_CONFIGS.map((config, index) => ({
      clusterName: config.clusterName,
      result: results[index],
    }))
      .filter(
        (res): res is { clusterName: string; result: PromiseRejectedResult } =>
          res.result.status === 'rejected'
      )
      .map((res) => ({
        clusterName: res.clusterName,
        httpStatus: res.result.reason?.httpStatusCode ?? undefined,
      })),
  };
};

export const getCachedAllDomains = cache(getAllDomains);
