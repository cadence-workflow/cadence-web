'use client';

import { useCallback, useEffect, useMemo } from 'react';

import queryString from 'query-string';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import useMergedInfiniteQueries from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries';
import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import request from '@/utils/request';
import { RequestError } from '@/utils/request/request-error';

import { type DomainsListingFailedCluster } from '../domains-page-error-banner/domains-page-error-banner.types';
import { type DomainData } from '../domains-page.types';
import getUniqueDomains from '../helpers/get-unique-domains';

const PAGE_SIZE = 100;

export default function useListDomains() {
  const { data: clusters } = useSuspenseConfigValue('CLUSTERS_PUBLIC');

  const queries = useMemo(
    () =>
      clusters.map((cluster) => ({
        queryKey: ['listDomains', cluster.clusterName] as const,
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: ListDomainsResponse) => {
          if (!lastPage.nextPage) return undefined;
          return lastPage.nextPage;
        },
        queryFn: async ({
          pageParam,
          queryKey: [_, clusterName],
        }: {
          pageParam: string | undefined;
          queryKey: readonly [string, string];
        }) =>
          request(
            queryString.stringifyUrl({
              url: `/api/clusters/${clusterName}/domains`,
              query: {
                pageSize: PAGE_SIZE.toString(),
                nextPage: pageParam,
              },
            })
          ).then((res) => res.json()),
        retry: false as const,
        refetchOnWindowFocus: (query: { state: { status: string } }) =>
          query.state.status !== 'error',
      })),
    [clusters]
  );

  const flattenResponse = useCallback(
    (res: ListDomainsResponse) => res.domains,
    []
  );

  const [mergedResults, individualResults] = useMergedInfiniteQueries<
    DomainData,
    ListDomainsResponse,
    string | undefined,
    readonly [string, string]
  >({
    queries,
    pageSize: PAGE_SIZE,
    flattenResponse,
    compare: compareDomains,
  });

  useEffect(() => {
    if (mergedResults.hasNextPage && !mergedResults.isFetchingNextPage) {
      mergedResults.fetchNextPage();
    }
  }, [mergedResults]);

  const uniqueData = useMemo(
    () => getUniqueDomains(mergedResults.data),
    [mergedResults.data]
  );

  const failedClusters = useMemo(
    () =>
      individualResults.reduce<DomainsListingFailedCluster[]>(
        (acc, result, index) => {
          if (result.isError && result.error) {
            acc.push({
              clusterName: clusters[index].clusterName,
              httpStatus:
                result.error instanceof RequestError
                  ? result.error.status
                  : undefined,
            });
          }
          return acc;
        },
        []
      ),
    [individualResults, clusters]
  );

  return {
    ...mergedResults,
    data: uniqueData,
    failedClusters,
  };
}

function compareDomains(a: DomainData, b: DomainData): number {
  return a.name.localeCompare(b.name);
}
