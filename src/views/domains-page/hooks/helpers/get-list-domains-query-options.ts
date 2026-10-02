import queryString from 'query-string';

import { type SingleInfiniteQueryOptions } from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries.types';
import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import request from '@/utils/request';

export default function getListDomainsQueryOptions({
  cluster,
  pageSize,
}: {
  cluster: string;
  pageSize: number;
}): SingleInfiniteQueryOptions<
  ListDomainsResponse,
  string | undefined,
  readonly [string, string]
> {
  return {
    queryKey: ['listDomains', cluster] as const,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPage) return undefined;
      return lastPage.nextPage;
    },
    queryFn: async ({ pageParam, queryKey: [_, clusterName] }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/clusters/${clusterName}/domains`,
          query: {
            pageSize: pageSize.toString(),
            nextPage: pageParam as string,
          },
        })
      ).then((res) => res.json()),
    retry: false,
    refetchOnWindowFocus: (query) => query.state.status !== 'error',
  };
}
