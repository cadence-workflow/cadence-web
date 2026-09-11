'use client';

import { useCallback, useEffect, useMemo } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import useMergedInfiniteQueries from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries';
import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import { RequestError } from '@/utils/request/request-error';

import { type DomainsListingFailedCluster } from '../domains-page-error-banner/domains-page-error-banner.types';
import { LIST_DOMAINS_API_PAGE_SIZE } from '../domains-page.constants';
import { type DomainData } from '../domains-page.types';
import getUniqueDomains from '../helpers/get-unique-domains';

import getListDomainsQueryOptions from './helpers/get-list-domains-query-options';

export default function useListDomains() {
  const { data: clusters } = useSuspenseConfigValue('CLUSTERS_PUBLIC');

  const queries = useMemo(
    () =>
      clusters.map((cluster) =>
        getListDomainsQueryOptions({
          cluster: cluster.clusterName,
          pageSize: LIST_DOMAINS_API_PAGE_SIZE,
        })
      ),
    [clusters]
  );

  const flattenResponse = useCallback(
    (res: ListDomainsResponse) => res.domains,
    []
  );

  const compareDomains = useCallback(
    (a: DomainData, b: DomainData) => a.name.localeCompare(b.name),
    []
  );

  const [mergedResults, individualResults] = useMergedInfiniteQueries<
    DomainData,
    ListDomainsResponse,
    string | undefined,
    readonly [string, string]
  >({
    queries,
    pageSize: LIST_DOMAINS_API_PAGE_SIZE,
    flattenResponse,
    compare: compareDomains,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = mergedResults;

  const hasNextPageError = individualResults.some(
    (qr) => qr.isFetchNextPageError
  );

  // Eagerly load all pages
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !hasNextPageError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, hasNextPageError]);

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
