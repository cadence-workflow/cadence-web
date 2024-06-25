import { cache } from 'react';

import * as grpcClient from '@/utils/grpc/grpc-client';

export const getDomainInfo = async (clusterName: string, args: any) => {
  const result = await grpcClient
    .getClusterMethods(clusterName)
    .describeDomain(args);

  return result;
};

export const getCachedDomainInfo = cache(getDomainInfo);
