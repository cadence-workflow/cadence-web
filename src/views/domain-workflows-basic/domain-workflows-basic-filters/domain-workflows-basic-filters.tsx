'use client';
import { useState } from 'react';

import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsBasicFiltersConfig from '../config/domain-workflows-basic-filters.config';
import DOMAIN_WORKFLOWS_BASIC_SEARCH_DEBOUNCE_MS from '../config/domain-workflows-basic-search-debounce-ms.config';

import { styled } from './domain-workflows-basic-filters.styles';
import { type Props } from './domain-workflows-basic-filters.types';

export default function DomainWorkflowsBasicFilters({
  resetAllFilters,
  activeFiltersCount,
  queryParams,
  setQueryParams,
}: Props) {
  const [areFiltersShown, setAreFiltersShown] = useState(true);

  return (
    <styled.HeaderContainer>
      <styled.InputContainer>
        <styled.SearchContainer>
          <PageFiltersSearch
            pageQueryParamsConfig={domainPageQueryParamsConfig}
            searchQueryParamKey="workflowId"
            searchPlaceholder="Workflow ID"
            inputDebounceDurationMs={DOMAIN_WORKFLOWS_BASIC_SEARCH_DEBOUNCE_MS}
          />
          <PageFiltersSearch
            pageQueryParamsConfig={domainPageQueryParamsConfig}
            searchQueryParamKey="workflowType"
            searchPlaceholder="Workflow Type"
            inputDebounceDurationMs={DOMAIN_WORKFLOWS_BASIC_SEARCH_DEBOUNCE_MS}
          />
          <PageFiltersToggle
            isActive={areFiltersShown}
            onClick={() => {
              setAreFiltersShown((value) => !value);
            }}
            activeFiltersCount={activeFiltersCount}
          />
        </styled.SearchContainer>
      </styled.InputContainer>
      {areFiltersShown && (
        <styled.FiltersContainer>
          <PageFiltersFields
            pageFiltersConfig={domainWorkflowsBasicFiltersConfig}
            resetAllFilters={resetAllFilters}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </styled.FiltersContainer>
      )}
    </styled.HeaderContainer>
  );
}
