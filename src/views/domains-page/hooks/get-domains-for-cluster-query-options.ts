import { type UseQueryOptions } from '@tanstack/react-query';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type DomainData } from '../domains-page.types';
import filterIrrelevantDomains from '../helpers/filter-irrelevant-domains';

export default function getDomainsForClusterQueryOptions(
  clusterName: string
): UseQueryOptions<
  ListDomainsResponse,
  RequestError,
  Array<DomainData>,
  ['domains', string]
> {
  return {
    queryKey: ['domains', clusterName],
    queryFn: ({ queryKey: [_, cluster] }) =>
      request(`/api/domains?cluster=${encodeURIComponent(cluster)}`).then(
        (res) => res.json()
      ),
    select: (data) => filterIrrelevantDomains(clusterName, data.domains),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10_000),
  };
}
