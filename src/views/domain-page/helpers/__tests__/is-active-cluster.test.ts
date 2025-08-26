import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import isActiveCluster from '../is-active-cluster';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(isActiveCluster.name, () => {
  it('should return true when cluster is in activeClusters.regionToCluster for active-active domain', () => {
    expect(isActiveCluster(mockActiveActiveDomain, 'cluster0')).toBe(true);
    expect(isActiveCluster(mockActiveActiveDomain, 'cluster1')).toBe(true);
  });

  it('should return false when cluster is not in activeClusters.regionToCluster for active-active domain', () => {
    const domain = mockActiveActiveDomain;
    const cluster = 'non-existent-cluster';

    const result = isActiveCluster(domain, cluster);

    expect(result).toBe(false);
  });

  it('should return true when cluster matches activeClusterName for active-passive domain', () => {
    const domain = getDomainObj({
      id: 'test-domain-id',
      name: 'test-domain',
      activeClusterName: 'cluster_1',
      activeClusters: null,
    });
    const cluster = 'cluster_1';

    const result = isActiveCluster(domain, cluster);

    expect(result).toBe(true);
  });

  it('should return false when cluster does not match activeClusterName for regular domain', () => {
    const domain = getDomainObj({
      id: 'test-domain-id',
      name: 'test-domain',
      activeClusterName: 'cluster_1',
      activeClusters: null,
    });
    const cluster = 'cluster_2';

    const result = isActiveCluster(domain, cluster);

    expect(result).toBe(false);
  });
});
