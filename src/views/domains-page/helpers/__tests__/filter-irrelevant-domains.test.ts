import { getDomainObj } from '../../__fixtures__/domains';
import type { DomainData } from '../../domains-page.types';
import filterIrrelevantDomains from '../filter-irrelevant-domains';

describe(filterIrrelevantDomains.name, () => {
  it('should filter out irrelevant domains', () => {
    const domains = [
      getDomainObj({
        id: '1',
        name: '1',
        clusters: [{ clusterName: 'ClusterA' }],
      }),
      // Not relevant to the specified cluster
      getDomainObj({
        id: '1',
        name: '2',
        clusters: [{ clusterName: 'ClusterB' }],
      }),
      getDomainObj({
        id: '3',
        name: '3',
        clusters: [{ clusterName: 'ClusterA' }, { clusterName: 'ClusterC' }],
      }),
      // Deleted/Invalid domains
      getDomainObj({
        id: '4',
        name: '4',
        clusters: [{ clusterName: 'ClusterA' }, { clusterName: 'ClusterC' }],
        status: 'DOMAIN_STATUS_DELETED',
      }),
      getDomainObj({
        id: '5',
        name: '5',
        clusters: [{ clusterName: 'ClusterA' }, { clusterName: 'ClusterC' }],
        status: 'DOMAIN_STATUS_INVALID',
      }),
    ];

    const result = filterIrrelevantDomains('ClusterA', domains);

    expect(result).toEqual([domains[0], domains[2]]);
  });

  it('should return an empty array if no domains are relevant', () => {
    const domains = [
      getDomainObj({
        id: '1',
        name: '1',
        clusters: [{ clusterName: 'ClusterB' }],
      }),
      getDomainObj({
        id: '2',
        name: '2',
        clusters: [{ clusterName: 'ClusterC' }],
      }),
    ];

    const result = filterIrrelevantDomains('ClusterA', domains);

    expect(result).toEqual([]);
  });

  it('should return an empty array if domains array is empty', () => {
    const domains: DomainData[] = [];

    const result = filterIrrelevantDomains('ClusterA', domains);

    expect(result).toEqual([]);
  });

  it('should handle null or undefined domains array gracefully', () => {
    // @ts-expect-error domains come from backend so testing null behavior
    const resultWithNull = filterIrrelevantDomains('ClusterA', null);
    const resultWithUndefined = filterIrrelevantDomains(
      'ClusterA',
      // @ts-expect-error domains come from backend so testing undefined behavior
      undefined
    );

    expect(resultWithNull).toEqual([]);
    expect(resultWithUndefined).toEqual([]);
  });
});
