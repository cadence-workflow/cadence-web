'use client';
import { useState } from 'react';

import { Segment, SegmentedControl } from 'baseui/segmented-control';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';
import DOMAIN_WORKFLOWS_SEARCH_DEBOUNCE_MS from '../config/domain-workflows-search-debounce-ms.config';
import DomainWorkflowsQueryInput from '../domain-workflows-query-input/domain-workflows-query-input';
import DomainWorkflowsQueryLabel from '../domain-workflows-query-label/domain-workflows-query-label';
import useListWorkflows from '../hooks/use-list-workflows';

import { overrides, styled } from './domain-workflows-header.styles';
import { type Props } from './domain-workflows-header.types';

export default function DomainWorkflowsHeader({ domain, cluster }: Props) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig: domainWorkflowsFiltersConfig,
      pageQueryParamsConfig: domainPageQueryParamsConfig,
    });

  const { refetch, isFetching } = useListWorkflows({
    domain,
    cluster,
  });

  return (
    <styled.HeaderContainer>
      <styled.InputContainer>
        <SegmentedControl
          activeKey={queryParams.inputType}
          onChange={({ activeKey }) => {
            setQueryParams(
              {
                inputType: activeKey === 'query' ? 'query' : 'search',
              },
              { replace: false, pageRerender: true }
            );
          }}
          overrides={overrides.inputToggle}
        >
          <Segment
            overrides={overrides.inputToggleSegment}
            key="search"
            label="Search"
          />
          <Segment
            overrides={overrides.inputToggleSegment}
            key="query"
            label={<DomainWorkflowsQueryLabel />}
          />
        </SegmentedControl>
        {queryParams.inputType === 'query' ? (
          <DomainWorkflowsQueryInput
            value={queryParams.query}
            setValue={(v) => setQueryParams({ query: v })}
            refetchQuery={refetch}
            isQueryRunning={isFetching}
          />
        ) : (
          <styled.SearchContainer>
            <PageFiltersSearch
              pageQueryParamsConfig={domainPageQueryParamsConfig}
              searchQueryParamKey="search"
              searchPlaceholder="Search for Workflow ID, Run ID, or Workflow Type"
              inputDebounceDurationMs={DOMAIN_WORKFLOWS_SEARCH_DEBOUNCE_MS}
            />
            <PageFiltersToggle
              isActive={areFiltersShown}
              onClick={() => {
                setAreFiltersShown((value) => !value);
              }}
              activeFiltersCount={activeFiltersCount}
            />
          </styled.SearchContainer>
        )}
      </styled.InputContainer>
      {queryParams.inputType === 'search' && areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={domainWorkflowsFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </styled.HeaderContainer>
  );
}
