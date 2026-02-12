import 'server-only';

import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';

import filterIrrelevantDomains from './filter-irrelevant-domains';

export default async function getDomainsForCluster(
  clusterName: string,
  pageSize: number
) {
  const clusterMethods = await grpcClient.getClusterMethods(clusterName);

  return clusterMethods.listDomains({ pageSize }).then(
    ({ domains }) => {
      if (domains.length >= pageSize - 100) {
        logger.warn(
          {
            domainsCount: domains.length,
            maxDomainsCount: pageSize,
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
}
