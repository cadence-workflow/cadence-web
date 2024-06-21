import { getDomainObj } from '../../__fixtures__/domains';
import { type DomainData } from '../../domains-page.types';
import getUniqueDomains from '../get-unique-domains';

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
});
