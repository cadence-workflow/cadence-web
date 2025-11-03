'use client';
import PageFilters from '@/components/page-filters/page-filters';

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
      />
    </styled.Container>
  );
}
