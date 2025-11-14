import { PRIMARY_CLUSTER_SCOPE } from '../../domain-page-failovers/domain-page-failovers.constants';
import { type ClusterFailover } from '../../domain-page-failovers/domain-page-failovers.types';
import clusterFailoverMatchesAttribute from '../cluster-failover-matches-attribute';

describe(clusterFailoverMatchesAttribute.name, () => {
  it('should return true when clusterAttribute is null and scope is PRIMARY_CLUSTER_SCOPE', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: null,
    };

    expect(
      clusterFailoverMatchesAttribute(clusterFailover, PRIMARY_CLUSTER_SCOPE)
    ).toBe(true);
  });

  it('should return false when clusterAttribute is null and scope is not PRIMARY_CLUSTER_SCOPE', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: null,
    };

    expect(
      clusterFailoverMatchesAttribute(clusterFailover, 'other-scope')
    ).toBe(false);
  });

  it('should return false when clusterAttribute is null and scope is undefined', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: null,
    };

    expect(clusterFailoverMatchesAttribute(clusterFailover)).toBe(false);
  });

  it('should return true when clusterAttribute scope matches and no value is provided', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(clusterFailoverMatchesAttribute(clusterFailover, 'city')).toBe(true);
  });

  it('should return false when clusterAttribute scope does not match and no value is provided', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(
      clusterFailoverMatchesAttribute(clusterFailover, 'other-scope')
    ).toBe(false);
  });

  it('should return true when clusterAttribute scope and name both match', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(
      clusterFailoverMatchesAttribute(clusterFailover, 'city', 'new_york')
    ).toBe(true);
  });

  it('should return false when clusterAttribute scope matches but name does not match', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(
      clusterFailoverMatchesAttribute(clusterFailover, 'city', 'san_francisco')
    ).toBe(false);
  });

  it('should return false when clusterAttribute scope does not match even if name matches', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(
      clusterFailoverMatchesAttribute(
        clusterFailover,
        'other-scope',
        'new_york'
      )
    ).toBe(false);
  });

  it('should return false when clusterAttribute scope does not match and value is provided', () => {
    const clusterFailover: ClusterFailover = {
      fromCluster: {
        activeClusterName: 'cluster1',
        failoverVersion: '1',
      },
      toCluster: {
        activeClusterName: 'cluster2',
        failoverVersion: '2',
      },
      clusterAttribute: {
        scope: 'city',
        name: 'new_york',
      },
    };

    expect(
      clusterFailoverMatchesAttribute(
        clusterFailover,
        'other-scope',
        'san_francisco'
      )
    ).toBe(false);
  });
});
