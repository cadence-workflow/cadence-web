import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';

import { mockActiveActiveDomain } from '../../__fixtures__/active-active-domain';
import isActiveActiveDomain from '../is-active-active-domain';

const regularDomain = getDomainObj({
  id: 'test-regular-domain-id',
  name: 'test-regular-domain',
  activeClusters: null,
});

const domainWithEmptyActiveClusters = getDomainObj({
  id: 'test-empty-active-clusters-id',
  name: 'test-empty-active-clusters',
  activeClusters: {
    regionToCluster: {},
  },
});

const domainWithNullActiveClusters = getDomainObj({
  id: 'test-null-active-clusters-id',
  name: 'test-null-active-clusters',
  activeClusters: null,
});

const domainWithUndefinedActiveClusters = getDomainObj({
  id: 'test-undefined-active-clusters-id',
  name: 'test-undefined-active-clusters',
  activeClusters: undefined,
});

describe(isActiveActiveDomain.name, () => {
  it('should return true for a domain with active clusters and non-empty regionToCluster', () => {
    const result = isActiveActiveDomain(mockActiveActiveDomain);
    expect(result).toBe(true);
  });

  it('should return false for a domain with null activeClusters', () => {
    const result = isActiveActiveDomain(regularDomain);
    expect(result).toBe(false);
  });

  it('should return false for a domain with empty regionToCluster object', () => {
    const result = isActiveActiveDomain(domainWithEmptyActiveClusters);
    expect(result).toBe(false);
  });

  it('should return false for a domain with undefined activeClusters', () => {
    const result = isActiveActiveDomain(domainWithUndefinedActiveClusters);
    expect(result).toBe(false);
  });

  it('should return false for a domain with null activeClusters property', () => {
    const result = isActiveActiveDomain(domainWithNullActiveClusters);
    expect(result).toBe(false);
  });

  it('should return true for a domain with at least one region in regionToCluster', () => {
    const domainWithSingleRegion = getDomainObj({
      id: 'test-single-region-id',
      name: 'test-single-region',
      activeClusters: {
        regionToCluster: {
          region0: {
            activeClusterName: 'cluster0',
            failoverVersion: '0',
          },
        },
      },
    });
    const result = isActiveActiveDomain(domainWithSingleRegion);
    expect(result).toBe(true);
  });
});
