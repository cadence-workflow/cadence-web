import {
  type GRPCClusterMethods,
  getClusterMethods,
} from '@/utils/grpc/grpc-client';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import isObjectOfStringKeyValue from '../helpers/is-object-of-string-key-value';
import { type MiddlewareFunction } from '../route-handlers-middleware.types';

const grpcClusterMethods: MiddlewareFunction<
  ['grpcClusterMethods', GRPCClusterMethods]
> = async (_, { params }, ctx) => {
  let grpcMetadata: GRPCMetadata | undefined;
  if (isObjectOfStringKeyValue(ctx.grpcMetadata)) {
    grpcMetadata = ctx.grpcMetadata;
  }
  if (!params.cluster) {
    throw new Error(`Cluster not found: ${params.cluster}`);
  }

  const clusterMethods = await getClusterMethods(params.cluster, grpcMetadata);

  return ['grpcClusterMethods', clusterMethods];
};

export default grpcClusterMethods;
