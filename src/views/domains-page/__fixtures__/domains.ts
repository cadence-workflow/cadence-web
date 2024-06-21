import { Long } from '@grpc/proto-loader';

import { type DomainData } from '../domains-page.types';

export const getDomainObj = (
  overrides: Pick<DomainData, 'id' | 'name'> & Partial<DomainData>
): DomainData => ({
  status: 'DOMAIN_STATUS_REGISTERED',
  badBinaries: null,
  data: {},
  description: '',
  asyncWorkflowConfig: null,
  historyArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
  failoverInfo: null,
  isGlobalDomain: true,
  ownerEmail: 'test@test.uber.com',
  isolationGroups: null,
  visibilityArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
  visibilityArchivalUri: '',
  workflowExecutionRetentionPeriod: null,
  historyArchivalUri: '',
  failoverVersion: new Long(123456),
  activeClusterName: 'ClusterA',
  clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
  ...overrides,
});

export const globalDomain: DomainData = getDomainObj({
  id: 'test-global-domain-id',
  name: 'test-global-domain',
  activeClusterName: 'test-global-cluster-2',
  clusters: [
    { clusterName: 'test-global-cluster-1' },
    { clusterName: 'test-global-cluster-2' },
  ],
});

export const localDomain: DomainData = getDomainObj({
  id: 'test-local-domain-id',
  name: 'test-local-domain',
  activeClusterName: 'test-local-cluster-1',
  clusters: [{ clusterName: 'test-local-cluster-1' }],
});
