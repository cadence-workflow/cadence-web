import queryString from 'query-string';

import { type ListFailoverHistoryRequestQueryParams } from '@/route-handlers/list-failover-history/list-failover-history.types';
import request from '@/utils/request';

import {
  type DomainFailoverHistoryQueryOptions,
  type UseDomainFailoverHistoryReactQueryParams,
} from './use-domain-failover-history.types';

export default function getDomainFailoverHistoryQueryOptions(
  params: UseDomainFailoverHistoryReactQueryParams
): DomainFailoverHistoryQueryOptions {
  return {
    queryKey: ['listFailoverHistory', params],
    queryFn: async ({
      queryKey: [_, { domainName, domainId, cluster }],
      pageParam,
    }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domainName}/${cluster}/failovers`,
          query: {
            domainId,
            nextPage: pageParam,
          } as const satisfies ListFailoverHistoryRequestQueryParams,
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (res) => res.nextPageToken,
    retry: false,
  };
}
