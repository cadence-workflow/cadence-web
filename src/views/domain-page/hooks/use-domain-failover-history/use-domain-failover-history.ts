import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import clusterFailoverMatchesAttribute from '../../helpers/cluster-failover-matches-attribute';

import getDomainFailoverHistoryQueryOptions from './get-domain-failover-history-query-options';
import { type UseDomainFailoverHistoryParams } from './use-domain-failover-history.types';

export default function useDomainFailoverHistory(
  params: UseDomainFailoverHistoryParams
) {
  const { clusterAttributeScope, clusterAttributeValue, ...reactQueryParams } =
    params;

  const queryResult = useInfiniteQuery(
    getDomainFailoverHistoryQueryOptions(reactQueryParams)
  );

  const allFailoverEvents = useMemo(() => {
    if (!queryResult.data) return [];
    return queryResult.data.pages.flatMap((page) => page.failoverEvents ?? []);
  }, [queryResult.data]);

  const filteredFailoverEvents = useMemo(() => {
    if (!clusterAttributeScope) return allFailoverEvents;

    return allFailoverEvents.filter((failover) =>
      failover.clusterFailovers.some((clusterFailover) =>
        clusterFailoverMatchesAttribute(
          clusterFailover,
          clusterAttributeScope,
          clusterAttributeValue
        )
      )
    );
  }, [allFailoverEvents, clusterAttributeScope, clusterAttributeValue]);

  return {
    ...queryResult,
    allFailoverEvents,
    filteredFailoverEvents,
  };
}
