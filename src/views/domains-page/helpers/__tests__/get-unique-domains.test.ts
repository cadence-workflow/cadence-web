import getUniqueDomains from '../get-unique-domains';
import { DomainData } from '../../domains-page.types';

describe('getUniqueDomains', () => {
  it('should return unique domains based on id-name-activeClusterName', () => {
    const domains: DomainData[] = [
      {
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      },
      {
        id: '2',
        name: 'Domain2',
        activeClusterName: 'ClusterB',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      },
      { id: '1', name: 'Domain1', activeClusterName: 'ClusterA', clusters: [] },
    ];

    const uniqueDomains = getUniqueDomains(domains);

    expect(uniqueDomains).toEqual([
      {
        id: '1',
        name: 'Domain1',
        activeClusterName: 'ClusterA',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      },
      {
        id: '2',
        name: 'Domain2',
        activeClusterName: 'ClusterB',
        clusters: [{ clusterName: 'clusterA' }, { clusterName: 'clusterB' }],
      },
    ]);
  });

  it('should handle all domains being duplicates', () => {
    const domains: DomainData[] = [
      { id: '1', name: 'Domain1', activeClusterName: 'ClusterA', clusters: [] },
      { id: '1', name: 'Domain1', activeClusterName: 'ClusterA', clusters: [] },
      { id: '1', name: 'Domain1', activeClusterName: 'ClusterA', clusters: [] },
    ];

    const uniqueDomains = getUniqueDomains(domains);

    expect(uniqueDomains).toEqual([
      { id: '1', name: 'Domain1', activeClusterName: 'ClusterA', clusters: [] },
    ]);
  });
});
