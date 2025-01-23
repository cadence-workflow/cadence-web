import { type ClusterConfig } from './clusters.types';

export type PublicClusterConfig = Pick<ClusterConfig, 'clusterName'>;

export type PublicClustersConfigs = Array<PublicClusterConfig>;
