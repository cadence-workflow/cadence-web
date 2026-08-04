import { type UseQueryOptions } from '@tanstack/react-query';

import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type DomainData } from '../domains-page.types';

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
      request(`/api/clusters/${encodeURIComponent(cluster)}/domains`).then(
        (res) => res.json()
      ),
    select: (data) => data.domains,
    staleTime: 60_000,
    retry: 3,
    refetchOnWindowFocus: (query) => query.state.status !== 'error',
    retryDelay: 5_000,
  };
}
