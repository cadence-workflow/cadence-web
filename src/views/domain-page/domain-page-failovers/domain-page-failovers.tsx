'use client';
import React from 'react';

import Table from '@/components/table/table';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import domainPageFailoversTableActiveActiveConfig from '../config/domain-page-failovers-table-active-active.config';
import domainPageFailoversTableConfig from '../config/domain-page-failovers-table.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import useDomainFailoverHistory from '../hooks/use-domain-failover-history/use-domain-failover-history';

export default function DomainPageFailovers({
  domain,
  cluster,
}: DomainPageTabContentProps) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const {
    filteredFailoverEvents,
    allFailoverEvents,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDomainFailoverHistory({
    domainName: domain,
    domainId: domainDescription.id,
    cluster,
    // TODO: set and pass filters here, but only for AA domains
  });

  return (
    <Table
      data={filteredFailoverEvents}
      shouldShowResults={!isLoading && filteredFailoverEvents.length > 0}
      endMessageProps={{
        kind: 'infinite-scroll',
        hasData: allFailoverEvents.length > 0,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
      columns={
        isActiveActiveDomain(domainDescription)
          ? domainPageFailoversTableActiveActiveConfig
          : domainPageFailoversTableConfig
      }
    />
  );
}
