import { type Query } from '@tanstack/react-query';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import { type RequestError } from '@/utils/request/request-error';

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
    expect(options.retry).toEqual(3);
    expect(options.retryDelay).toEqual(5_000);
  });

  it('refetches on window focus unless the query is in error state', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    const refetchOnWindowFocus = options.refetchOnWindowFocus;
    if (typeof refetchOnWindowFocus !== 'function') {
      throw new Error('Expected refetchOnWindowFocus to be a function');
    }

    const getMockQuery = (status: 'success' | 'error' | 'pending') =>
      ({
        state: { status },
      }) as Query<
        ListDomainsResponse,
        RequestError,
        ListDomainsResponse,
        ['domains', string]
      >;

    expect(refetchOnWindowFocus(getMockQuery('success'))).toEqual(true);
    expect(refetchOnWindowFocus(getMockQuery('pending'))).toEqual(true);
    expect(refetchOnWindowFocus(getMockQuery('error'))).toEqual(false);
  });

  it('selects domains from the response', () => {
    const options = getDomainsForClusterQueryOptions('test-cluster');

    const domains = [
      getDomainObj({ id: 'domain-1', name: 'domain-1' }),
      getDomainObj({ id: 'domain-2', name: 'domain-2' }),
    ];

    expect(options.select?.({ domains })).toEqual(domains);
  });
});
