'use client';
import { useState } from 'react';

import { Segment, SegmentedControl } from 'baseui/segmented-control';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import {
  type PageQueryParamSetterValues,
  type PageQueryParamKeys,
  type PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import useListWorkflows from '../hooks/use-list-workflows/use-list-workflows';

import WORKFLOWS_SEARCH_DEBOUNCE_MS from './config/workflows-search-debounce-ms.config';
import { overrides, styled } from './workflows-header.styles';
import { type Props } from './workflows-header.types';
import WorkflowsQueryInput from './workflows-query-input/workflows-query-input';
import WorkflowsQueryLabel from './workflows-query-label/workflows-query-label';

export default function WorkflowsHeader<
  P extends PageQueryParams,
  I extends PageQueryParamKeys<P>,
  S extends PageQueryParamKeys<P>,
  Q extends PageQueryParamKeys<P>,
>({
  domain,
  cluster,
  pageQueryParamsConfig,
  pageFiltersConfig,
  filtersValues,
  inputTypeQueryParamKey,
  searchQueryParamKey,
  queryStringQueryParamKey,
}: Props<P, I, S, Q>) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig,
      pageQueryParamsConfig,
    });

  const { inputType, query } = filtersValues;

  const { refetch, isFetching } = useListWorkflows({
    domain,
    cluster,
    filtersValues,
  });

  return (
    <styled.HeaderContainer>
      <styled.InputContainer>
        <SegmentedControl
          activeKey={inputType}
          onChange={({ activeKey }) => {
            setQueryParams(
              {
                [inputTypeQueryParamKey]:
                  activeKey === 'query' ? 'query' : 'search',
              } as Partial<PageQueryParamSetterValues<P>>,
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
            label={<WorkflowsQueryLabel />}
          />
        </SegmentedControl>
        {inputType === 'query' ? (
          <WorkflowsQueryInput
            value={query}
            setValue={(v) =>
              setQueryParams({
                [queryStringQueryParamKey]: v,
              } as Partial<PageQueryParamSetterValues<P>>)
            }
            refetchQuery={refetch}
            isQueryRunning={isFetching}
          />
        ) : (
          <styled.SearchContainer>
            <PageFiltersSearch
              pageQueryParamsConfig={pageQueryParamsConfig}
              searchQueryParamKey={searchQueryParamKey}
              searchPlaceholder="Search for Workflow ID, Run ID, or Workflow Type"
              inputDebounceDurationMs={WORKFLOWS_SEARCH_DEBOUNCE_MS}
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
      {inputType === 'search' && areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={pageFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </styled.HeaderContainer>
  );
}
