import { type ActiveActiveDomain } from '../active-active.types';

export const mockActiveActiveDomain: ActiveActiveDomain = {
  clusters: [
    {
      clusterName: 'cluster0',
    },
    {
      clusterName: 'cluster1',
    },
  ],
  data: {},
  id: 'ac531e7e-2915-4d71-ba11-a18f11db09fd',
  name: 'mock-domain-active-active',
  status: 'DOMAIN_STATUS_REGISTERED',
  description: '',
  ownerEmail: '',
  workflowExecutionRetentionPeriod: {
    seconds: '86400',
    nanos: 0,
  },
  badBinaries: {
    binaries: {},
  },
  historyArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
  historyArchivalUri: '',
  visibilityArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
  visibilityArchivalUri: '',
  activeClusterName: '',
  failoverVersion: '-24',
  isGlobalDomain: true,
  failoverInfo: null,
  isolationGroups: {
    isolationGroups: [],
  },
  asyncWorkflowConfig: {
    enabled: false,
    predefinedQueueName: '',
    queueType: '',
    queueConfig: null,
  },
  activeClusters: {
    regionToCluster: {
      region0: {
        activeClusterName: 'cluster0',
        failoverVersion: '0',
      },
      region1: {
        activeClusterName: 'cluster1',
        failoverVersion: '2',
      },
    },
  },
};
