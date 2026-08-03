import { RequestError } from '@/utils/request/request-error';

import { getDomainObj } from '../../__fixtures__/domains';
import getDomainsForClusterQueryOptions from '../get-domains-for-cluster-query-options';

describe(getDomainsForClusterQueryOptions.name, () => {
  it('returns a query key scoped to the cluster', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    expect(options.queryKey).toEqual(['domains', 'test-cluster']);
  });

  it('configures caching and retries', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    expect(options.staleTime).toEqual(60_000);
    expect(options.gcTime).toEqual(5 * 60_000);
    expect(options.retry).toEqual(3);
  });

  it('uses exponential backoff capped at 10 seconds for retry delays', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    const retryDelay = options.retryDelay;
    if (typeof retryDelay !== 'function') {
      throw new Error('Expected retryDelay to be a function');
    }

    const mockError = new RequestError(
      'mock error',
      '/api/cluster/test-cluster/domains',
      500
    );
    expect(retryDelay(0, mockError)).toEqual(1_000);
    expect(retryDelay(1, mockError)).toEqual(2_000);
    expect(retryDelay(2, mockError)).toEqual(4_000);
    expect(retryDelay(10, mockError)).toEqual(10_000);
  });

  it('filters out domains that are not relevant to the cluster', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    const relevantDomain = getDomainObj({
      id: 'relevant-id',
      name: 'relevant-domain',
      clusters: [{ clusterName: 'test-cluster' }],
    });
    const otherClusterDomain = getDomainObj({
      id: 'other-id',
      name: 'other-domain',
      clusters: [{ clusterName: 'other-cluster' }],
    });
    const deletedDomain = getDomainObj({
      id: 'deleted-id',
      name: 'deleted-domain',
      status: 'DOMAIN_STATUS_DELETED',
      clusters: [{ clusterName: 'test-cluster' }],
    });

    expect(
      options.select?.({
        domains: [relevantDomain, otherClusterDomain, deletedDomain],
      })
    ).toEqual([relevantDomain]);
  });
});
