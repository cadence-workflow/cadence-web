import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { type ListFailoverHistoryResponse } from '@/route-handlers/list-failover-history/list-failover-history.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseDomainFailoverHistoryReactQueryParams = {
  domainName: string;
  domainId: string;
  cluster: string;
};

export type UseDomainFailoverHistoryFilterParams = {
  clusterAttributeScope?: string;
  clusterAttributeValue?: string;
};

export type UseDomainFailoverHistoryParams =
  UseDomainFailoverHistoryReactQueryParams &
    UseDomainFailoverHistoryFilterParams;

export type DomainFailoverHistoryQueryKey = [
  string,
  UseDomainFailoverHistoryReactQueryParams,
];

export type DomainFailoverHistoryQueryOptions = UseInfiniteQueryOptions<
  ListFailoverHistoryResponse,
  RequestError,
  InfiniteData<ListFailoverHistoryResponse, string | undefined>,
  ListFailoverHistoryResponse,
  DomainFailoverHistoryQueryKey,
  string | undefined
>;
