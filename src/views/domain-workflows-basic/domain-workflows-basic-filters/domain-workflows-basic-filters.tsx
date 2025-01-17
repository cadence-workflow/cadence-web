'use client';
import { useEffect, useState } from 'react';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import dayjs from '@/utils/datetime/dayjs';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsBasicFiltersConfig from '../config/domain-workflows-basic-filters.config';
import DOMAIN_WORKFLOWS_BASIC_SEARCH_DEBOUNCE_MS from '../config/domain-workflows-basic-search-debounce-ms.config';
import DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG from '../config/domain-workflows-basic-start-days.config';

import { styled } from './domain-workflows-basic-filters.styles';

export default function DomainWorkflowsBasicFilters() {
  const [areFiltersShown, setAreFiltersShown] = useState(true);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig: domainWorkflowsBasicFiltersConfig,
      pageQueryParamsConfig: domainPageQueryParamsConfig,
    });

  useEffect(() => {
    if (!queryParams.timeRangeStart && !queryParams.timeRangeEnd) {
      const now = dayjs();
      setQueryParams({
        timeRangeStart: now
          .subtract(DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG, 'days')
          .toISOString(),
        timeRangeEnd: now.toISOString(),
      });
    }
  }, [queryParams.timeRangeStart, queryParams.timeRangeEnd, setQueryParams]);

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
        <PageFiltersFields
          pageFiltersConfig={domainWorkflowsBasicFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </styled.HeaderContainer>
  );
}
