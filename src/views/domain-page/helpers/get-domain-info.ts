import { cache } from 'react';
import * as grpcClient from '@/utils/grpc/grpc-client';

// TODO @adhitya.mamallan - use GRPC types here when they are ready
export const getDomainInfo = async (clusterName: string, args: any) => {
  const result =
    await grpcClient.clusterMethods[clusterName].describeDomain(args);

  return result;
};

export const getCachedDomainInfo = cache(getDomainInfo);
