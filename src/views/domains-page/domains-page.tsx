'use client';
import React from 'react';

import DomainsPageContextProvider from './domains-page-context-provider/domains-page-context-provider';
import DomainsPageErrorBanner from './domains-page-error-banner/domains-page-error-banner';
import DomainsPageFilters from './domains-page-filters/domains-page-filters';
import DomainsPageTitle from './domains-page-title/domains-page-title';
import DomainsPageTitleBadge from './domains-page-title-badge/domains-page-title-badge';
import DomainsTable from './domains-table/domains-table';
import useListDomains from './hooks/use-list-domains';

function DomainsPageContent() {
  const {
    data,
    failedClusters,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useListDomains();

  return (
    <>
      <DomainsPageTitle
        countBadge={<DomainsPageTitleBadge content={data.length} />}
      />
      <DomainsPageFilters />
      <DomainsPageErrorBanner failedClusters={failedClusters} />
      <DomainsTable
        domains={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

export default function DomainsPage() {
  return (
    <DomainsPageContextProvider>
      <DomainsPageContent />
    </DomainsPageContextProvider>
  );
}
