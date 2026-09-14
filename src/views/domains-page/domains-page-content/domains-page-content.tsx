'use client';
import React from 'react';

import DomainsPageErrorBanner from '../domains-page-error-banner/domains-page-error-banner';
import DomainsPageFilters from '../domains-page-filters/domains-page-filters';
import DomainsPageTitle from '../domains-page-title/domains-page-title';
import DomainsPageTitleBadge from '../domains-page-title-badge/domains-page-title-badge';
import DomainsTable from '../domains-table/domains-table';
import useFilteredDomains from '../hooks/use-filtered-domains';
import useListDomains from '../hooks/use-list-domains';

export default function DomainsPageContent() {
  const {
    data,
    failedClusters,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useListDomains();

  const { filteredDomains, totalCount } = useFilteredDomains(data);

  return (
    <>
      <DomainsPageTitle
        countBadge={
          <DomainsPageTitleBadge
            count={filteredDomains.length}
            totalCount={totalCount}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
          />
        }
      />
      <DomainsPageFilters />
      <DomainsPageErrorBanner failedClusters={failedClusters} />
      <DomainsTable
        domains={filteredDomains}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
