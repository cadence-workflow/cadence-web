import { DomainData } from '../domains-page.types';

export const globalDomain: DomainData = {
  id: 'test-global-domain-id',
  name: 'test-global-domain',
  activeClusterName: 'test-global-cluster-2',
  clusters: [
    { clusterName: 'test-global-cluster-1' },
    { clusterName: 'test-global-cluster-2' },
  ],
};

export const localDomain: DomainData = {
  id: 'test-local-domain-id',
  name: 'test-local-domain',
  activeClusterName: 'test-local-cluster-1',
  clusters: [{ clusterName: 'test-local-cluster-1' }],
};
