'use client';
import PageFilters from '@/components/page-filters/page-filters';
import { PAGE_FILTERS_SEARCH_DEBOUNCE_MS } from '@/components/page-filters/page-filters.constants';

import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';

import { styled } from './domains-page.filters.styles';

export default function DomainsPageFilters() {
  return (
    <styled.Container>
      <PageFilters
        searchQueryParamKey="searchText"
        searchPlaceholder="Find Cadence domain"
        pageFiltersConfig={domainsPageFiltersConfig}
        pageQueryParamsConfig={domainsPageQueryParamsConfig}
        inputDebounceDurationMs={PAGE_FILTERS_SEARCH_DEBOUNCE_MS}
      />
    </styled.Container>
  );
}
