'use client';
import React, { useContext } from 'react';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';

import { DomainsPageContext } from '../domains-page-context-provider/domains-page-context-provider';
import DomainsPageErrorBanner from '../domains-page-error-banner/domains-page-error-banner';
import DomainsPageFilters from '../domains-page-filters/domains-page-filters';
import DomainsPageTitle from '../domains-page-title/domains-page-title';
import DomainsPageTitleBadge from '../domains-page-title-badge/domains-page-title-badge';
import DomainsTable from '../domains-table/domains-table';
import useDomainsForClusters from '../hooks/use-domains-for-clusters';

export default function DomainsPageContent() {
  const { pageConfig } = useContext(DomainsPageContext);

  const { domains, failedClusters, isLoading } = useDomainsForClusters(
    pageConfig.CLUSTERS_PUBLIC.map(({ clusterName }) => clusterName)
  );

  return (
    <>
      <DomainsPageTitle
        countBadge={
          isLoading ? undefined : (
            <DomainsPageTitleBadge content={domains.length} />
          )
        }
      />
      <DomainsPageFilters />
      <DomainsPageErrorBanner failedClusters={failedClusters} />
      {isLoading ? (
        <SectionLoadingIndicator />
      ) : (
        <DomainsTable domains={domains} />
      )}
    </>
  );
}
