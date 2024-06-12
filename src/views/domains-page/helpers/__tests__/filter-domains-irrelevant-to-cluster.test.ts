import type { DomainData } from '../../domains-page.types';
import filterDomainsIrrelevantToCluster from '../filter-domains-irrelevant-to-cluster';

describe('filterDomainsIrrelevantToCluster', () => {
  it('should return domains relevant to the specified cluster', () => {
    // picking few domains data as clusters is the only required
    const domains: Pick<DomainData, 'clusters' | 'name'>[] = [
      { name: '1', clusters: [{ clusterName: 'ClusterA' }] },
      { name: '2', clusters: [{ clusterName: 'ClusterB' }] },
      {
        name: '3',
        clusters: [{ clusterName: 'ClusterA' }, { clusterName: 'ClusterC' }],
      },
    ];

    const result = filterDomainsIrrelevantToCluster('ClusterA', domains);

    expect(result).toEqual([
      { name: '1', clusters: [{ clusterName: 'ClusterA' }] },
      {
        name: '3',
        clusters: [{ clusterName: 'ClusterA' }, { clusterName: 'ClusterC' }],
      },
    ]);
  });

  it('should return an empty array if no domains are relevant to the specified cluster', () => {
    const domains: Pick<DomainData, 'clusters'>[] = [
      { clusters: [{ clusterName: 'ClusterB' }] },
      { clusters: [{ clusterName: 'ClusterC' }] },
    ];

    const result = filterDomainsIrrelevantToCluster('ClusterA', domains);

    expect(result).toEqual([]);
  });

  it('should return an empty array if domains array is empty', () => {
    const domains: DomainData[] = [];

    const result = filterDomainsIrrelevantToCluster('ClusterA', domains);

    expect(result).toEqual([]);
  });

  it('should handle null or undefined domains array gracefully', () => {
    //@ts-expect-error domains comes from backend so testing null behavior
    const resultWithNull = filterDomainsIrrelevantToCluster('ClusterA', null);
    const resultWithUndefined = filterDomainsIrrelevantToCluster(
      'ClusterA',
      //@ts-expect-error domains comes from backend so testing undefined behavior
      undefined
    );

    expect(resultWithNull).toEqual([]);
    expect(resultWithUndefined).toEqual([]);
  });
});
