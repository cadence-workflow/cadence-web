import { mockActiveActiveDomain } from '../../__fixtures__/active-active-domain';
import getDefaultClusterForActiveActiveDomain from '../get-default-cluster-for-active-active-domain';

describe(getDefaultClusterForActiveActiveDomain.name, () => {
  it('should return the lexicographically smallest cluster name when multiple clusters exist', () => {
    const domain = {
      ...mockActiveActiveDomain,
      activeClusters: {
        regionToCluster: {
          region0: {
            activeClusterName: 'cluster2',
            failoverVersion: '0',
          },
          region1: {
            activeClusterName: 'cluster1',
            failoverVersion: '2',
          },
          region2: {
            activeClusterName: 'cluster3',
            failoverVersion: '1',
          },
        },
      },
    };

    const result = getDefaultClusterForActiveActiveDomain(domain);
    expect(result).toBe('cluster1');
  });

  it('should return the only cluster name when only one cluster exists', () => {
    const domain = {
      ...mockActiveActiveDomain,
      activeClusters: {
        regionToCluster: {
          region0: {
            activeClusterName: 'single-cluster',
            failoverVersion: '0',
          },
        },
      },
    };

    const result = getDefaultClusterForActiveActiveDomain(domain);
    expect(result).toBe('single-cluster');
  });
});
