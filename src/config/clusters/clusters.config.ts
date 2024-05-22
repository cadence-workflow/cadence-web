import GRPC_PEERS from '../grpc/grpc-peers';
import GRPC_SERVICES_NAMES from '../grpc/grpc-services-names';
import CLUSTER_NAMES from './cluster-names.config';
import { ClusterConfig, ClustersConfigs } from './clusters.types';

const configsHasSameLength = [GRPC_PEERS, GRPC_SERVICES_NAMES].every(
  (config) => config.length === CLUSTER_NAMES.length
);
/* if (!configsHasSameLength)
  throw new Error(
    "Failed to build cluster configuration: cluster names, grpc peers & service names count doesn't match"
  ); */

const CLUSTERS_CONFIGS: ClustersConfigs = CLUSTER_NAMES.map(
  (clusterName, i) => {
    return {
      clusterName: clusterName,
      grpc: {
        peer: GRPC_PEERS[i],
        serviceName: GRPC_SERVICES_NAMES[i],
        metadata: {},
      },
    } satisfies ClusterConfig;
  }
);

export default CLUSTERS_CONFIGS;
