'use client';
import PageFilters from '@/components/page-filters/page-filters';
import PageSection from '@/components/page-section/page-section';

import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';

export default function DomainsPageFilters() {
  return (
    <PageSection>
      <PageFilters
        searchQueryParamKey="searchText"
        searchPlaceholder="Find Cadence domain"
        pageFiltersConfig={domainsPageFiltersConfig}
        pageQueryParamsConfig={domainsPageQueryParamsConfig}
      />
    </PageSection>
  );
}
