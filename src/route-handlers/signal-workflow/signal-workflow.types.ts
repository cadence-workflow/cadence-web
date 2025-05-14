import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';

export type RequestParams = {
  params: {
    domain: string;
    cluster: string;
    workflowId: string;
    runId: string;
  };
};

export type Context = {
  grpcClusterMethods: GRPCClusterMethods;
};
