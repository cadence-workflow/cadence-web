import type { DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';

import isClusterAdvancedVisibilityEnabled from '../is-cluster-advanced-visibility-enabled';

const mockVisibilityStore = {
  features: [],
  backend: '',
  settings: [],
};

describe('isClusterAdvancedVisibilityEnabled', () => {
  it('should return true when advancedVisibilityEnabled feature is enabled', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      persistenceInfo: {
        visibilityStore: {
          ...mockVisibilityStore,
          features: [{ key: 'advancedVisibilityEnabled', enabled: true }],
        },
      },
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(true);
  });

  it('should return false when advancedVisibilityEnabled feature is disabled', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      persistenceInfo: {
        visibilityStore: {
          ...mockVisibilityStore,
          features: [{ key: 'advancedVisibilityEnabled', enabled: false }],
        },
      },
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(false);
  });

  it('should return false when advancedVisibilityEnabled feature is not present', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      persistenceInfo: {
        visibilityStore: {
          ...mockVisibilityStore,
          features: [{ key: 'someOtherFeature', enabled: true }],
        },
      },
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(false);
  });

  it('should return false when features array is empty', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      persistenceInfo: {
        visibilityStore: {
          ...mockVisibilityStore,
          features: [],
        },
      },
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(false);
  });

  it('should return false when visibilityStore is undefined', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      persistenceInfo: {},
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(false);
  });

  it('should return false when persistenceInfo is undefined', () => {
    const cluster: DescribeClusterResponse = {
      supportedClientVersions: null,
      // @ts-expect-error testing non esisting persistenceInfo
      persistenceInfo: undefined,
    };
    expect(isClusterAdvancedVisibilityEnabled(cluster)).toBe(false);
  });
});
