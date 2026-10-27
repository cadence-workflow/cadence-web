'use client';
import PageFilters from '@/components/page-filters/page-filters';
import WORKFLOWS_SEARCH_DEBOUNCE_MS from '@/views/shared/workflows-header/config/workflows-search-debounce-ms.config';

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
        inputDebounceDurationMs={WORKFLOWS_SEARCH_DEBOUNCE_MS}
      />
    </styled.Container>
  );
}
