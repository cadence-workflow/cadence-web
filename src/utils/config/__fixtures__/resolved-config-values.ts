import { type LoadedConfigResolvedValues } from '../config.types';

const mockResolvedConfigValues: LoadedConfigResolvedValues = {
  DYNAMIC: 2,
  ADMIN_SECURITY_TOKEN: 'mock-secret',
  CADENCE_WEB_PORT: '3000',
  COMPUTED: ['mock-computed'],
  COMPUTED_WITH_ARG: ['mock-arg'],
  DYNAMIC_WITH_ARG: 5,
  CLUSTERS: [
    {
      clusterName: 'mock-cluster1',
      grpc: {
        serviceName: 'mock-service1',
        peer: 'mock.localhost:7933',
      },
    },
    {
      clusterName: 'mock-cluster2',
      grpc: {
        serviceName: 'mock-service2',
        peer: 'mock.localhost:7933',
      },
    },
  ],
  CLUSTERS_PUBLIC: [
    {
      clusterName: 'mock-cluster1',
    },
    {
      clusterName: 'mock-cluster2',
    },
  ],
};
export default mockResolvedConfigValues;
