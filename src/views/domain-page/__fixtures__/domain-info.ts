import { type DomainInfo } from '../domain-page.types';

export const mockDomainInfo: DomainInfo = {
  activeClusterName: 'cluster_1',
  clusters: [{ clusterName: 'cluster_1' }, { clusterName: 'cluster_2' }],
  data: { Tier: '5', IsManagedByCadence: 'true' },
  id: 'mock-domain-staging-uuid',
  name: 'mock-domain-staging',
  status: 'DOMAIN_STATUS_REGISTERED',
  description: 'This is a mock domain used for test fixtures',
  ownerEmail: 'mockdomainowner@gmail.com',
  isGlobalDomain: true,
};

export const mockDomainInfoSingleCluster: DomainInfo = {
  activeClusterName: 'cluster_1',
  clusters: [{ clusterName: 'cluster_1' }],
  data: { Tier: '5', IsManagedByCadence: 'true' },
  id: 'mock-domain-staging-single-uuid',
  name: 'mock-domain-staging-single',
  status: 'DOMAIN_STATUS_REGISTERED',
  description:
    'This is a mock domain with single cluster used for test fixtures',
  ownerEmail: 'mockdomainowner@gmail.com',
  isGlobalDomain: true,
};
