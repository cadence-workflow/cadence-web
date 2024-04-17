import {
  GRPCRequestConfig,
  GRPCServiceConfig,
} from '@/utils/grpc/grpc-service';

export type ClusterConfig = {
  clusterName: string;
  grpc: GRPCRequestConfig & Pick<GRPCServiceConfig, 'peer'>;
};

export type ClustersConfigs = Array<ClusterConfig>;
