import 'server-only';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import getConfigValue from '@/utils/config/get-config-value';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import request from '@/utils/request';
import getUniqueDomains from '@/views/domains-page/helpers/get-unique-domains';

export async function getAllDomains() {
  const clustersConfigs = await getConfigValue('CLUSTERS');

  const results = await Promise.allSettled(
    clustersConfigs.map(
      async ({ clusterName }): Promise<ListDomainsResponse> =>
        await request(
          `/api/clusters/${encodeURIComponent(clusterName)}/domains`
        ).then((res) => res.json())
    )
  );

  results.forEach((res, index) => {
    if (res.status === 'rejected') {
      const clusterName = clustersConfigs[index].clusterName;
      logger.error(
        { error: res.reason, clusterName },
        `Failed to fetch domains for ${clusterName}` +
          (res.reason instanceof GRPCError ? `: ${res.reason.message}` : '')
      );
    }
  });

  return {
    domains: getUniqueDomains(
      results.flatMap((res) =>
        res.status === 'fulfilled' ? res.value.domains : []
      )
    ),
  };
}
