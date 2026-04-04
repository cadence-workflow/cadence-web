import 'server-only';

import * as grpc from '@grpc/grpc-js';

import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';
import getConfigValue from '@/utils/config/get-config-value';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';

export type DescribeDomainAcrossClustersResult = {
  domains: Domain[];
  hasPermissionDenied: boolean;
};

export default async function describeDomainAcrossClusters(
  domainName: string
): Promise<DescribeDomainAcrossClustersResult> {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');

  const results = await Promise.allSettled(
    CLUSTERS_CONFIGS.map(async ({ clusterName }) => {
      const clusterMethods = await grpcClient.getClusterMethods(clusterName);
      const response = await clusterMethods.describeDomain({
        name: domainName,
      });
      return response.domain;
    })
  );

  const domains: Domain[] = [];
  let hasPermissionDenied = false;

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      domains.push(result.value);
    } else if (result.status === 'rejected') {
      if (
        result.reason instanceof GRPCError &&
        result.reason.grpcStatusCode === grpc.status.PERMISSION_DENIED
      ) {
        hasPermissionDenied = true;
      } else if (
        !(
          result.reason instanceof GRPCError &&
          result.reason.grpcStatusCode === grpc.status.NOT_FOUND
        )
      ) {
        logger.error(
          { error: result.reason },
          `Failed to describe domain "${domainName}"`
        );
      }
    }
  }

  // Deduplicate domains by ID (same domain may be returned by multiple clusters)
  const uniqueDomainsMap = new Map<string, Domain>();
  for (const domain of domains) {
    if (!uniqueDomainsMap.has(domain.id)) {
      uniqueDomainsMap.set(domain.id, domain);
    }
  }

  return {
    domains: Array.from(uniqueDomainsMap.values()),
    hasPermissionDenied,
  };
}
