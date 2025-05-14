import { type LoadedConfigResolvedValues } from '../config.types';

const mockResolvedConfigValues: LoadedConfigResolvedValues = {
  ADMIN_SECURITY_TOKEN: 'mock-secret',
  CADENCE_WEB_PORT: '3000',
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
  WORKFLOW_ACTIONS_ENABLED: {
    terminate: 'ENABLED',
    cancel: 'ENABLED',
    signal: 'ENABLED',
    restart: 'ENABLED',
    reset: 'ENABLED',
  },
  EXTENDED_DOMAIN_INFO_ENABLED: {
    metadata: false,
    issues: false,
  },
};
export default mockResolvedConfigValues;
