'use client';
import { useState } from 'react';

import { Segment, SegmentedControl } from 'baseui/segmented-control';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';
import DomainWorkflowsQueryInput from '../domain-workflows-query-input/domain-workflows-query-input';

import { overrides, styled } from './domain-workflows-header.styles';

export default function DomainWorkflowsHeader() {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig: domainWorkflowsFiltersConfig,
      pageQueryParamsConfig: domainPageQueryParamsConfig,
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
            // TODO @adhitya.mamallan - replace this with the label tooltip component
            label="Query"
          />
        </SegmentedControl>
        {queryParams.inputType === 'query' ? (
          <DomainWorkflowsQueryInput
            value={queryParams.query}
            setValue={(v) => setQueryParams({ query: v })}
          />
        ) : (
          <>
            <PageFiltersSearch
              pageQueryParamsConfig={domainPageQueryParamsConfig}
              searchQueryParamKey="search"
              searchPlaceholder="Search for Workflow ID, Run ID, or Workflow Type"
            />
            <PageFiltersToggle
              isActive={areFiltersShown}
              onClick={() => {
                setAreFiltersShown((value) => !value);
              }}
              activeFiltersCount={activeFiltersCount}
            />
          </>
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
