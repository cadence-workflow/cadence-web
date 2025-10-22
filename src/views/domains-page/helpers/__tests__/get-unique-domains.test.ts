import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import { getDomainObj } from '../../__fixtures__/domains';
import { type DomainData } from '../../domains-page.types';
import getUniqueDomains from '../get-unique-domains';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe('getUniqueDomains', () => {
  it('should return unique domains based on id-name-activeClusterName', () => {
    const domains: DomainData[] = [
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      }),
      getDomainObj({
        id: '2',
        name: 'Domain2',
        activeClusterName: 'ClusterB',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      }),
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [],
      }),
    ];

    const uniqueDomains = getUniqueDomains(domains);

    expect(uniqueDomains).toEqual([domains[0], domains[1]]);
  });

  it('should handle all domains being duplicates', () => {
    const domains: DomainData[] = [
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [],
      }),
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [],
      }),
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [],
      }),
    ];

    const uniqueDomains = getUniqueDomains(domains);

    expect(uniqueDomains).toEqual([
      getDomainObj({
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [],
      }),
    ]);
  });

  it('should handle active-active domains using their default cluster for uniqueness', () => {
    const domains: DomainData[] = [
      mockActiveActiveDomain,
      getDomainObj({
        id: mockActiveActiveDomain.id,
        name: mockActiveActiveDomain.name,
        activeClusterName: 'cluster0', // Same as default cluster from mock
        clusters: [],
      }),
      getDomainObj({
        id: '2',
        name: 'Domain2',
        activeClusterName: 'ClusterB',
        clusters: [],
      }),
    ];

    const uniqueDomains = getUniqueDomains(domains);

    // Should return only 2 domains since the first two are duplicates
    // (active-active domain and regular domain with same id-name-defaultCluster)
    expect(uniqueDomains).toHaveLength(2);
    expect(uniqueDomains).toContain(domains[0]); // mockActiveActiveDomain
    expect(uniqueDomains).toContain(domains[2]); // Domain2
  });
});
