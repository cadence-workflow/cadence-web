import React, { useState, useMemo, useCallback } from 'react';

import { Button, KIND, SIZE } from 'baseui/button';
import { Search, Filter, Delete } from 'baseui/icon';
import { Input } from 'baseui/input';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import {
  type PageQueryParams,
  type PageQueryParamKeys,
  type PageQueryParamSetterValues,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { styled, overrides } from './page-filters.styles';
import { type Props } from './page-filters.types';

export default function PageFilters<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
>({
  searchQueryParamKey,
  searchPlaceholder,
  pageFiltersConfig,
  pageQueryParamsConfig,
}: Props<P, K>) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);
  const [queryParams, setQueryParams] = usePageQueryParams(
    pageQueryParamsConfig,
    { pageRerender: false }
  );

  const activeFiltersCount = useMemo(() => {
    const configsByKey = Object.fromEntries(
      pageQueryParamsConfig.map((c) => [c.key, c])
    );
    return pageFiltersConfig.filter((pageFilter) =>
      Object.keys(pageFilter.getValue(queryParams)).every(
        (queryParamKey: PageQueryParamKeys<P>) =>
          queryParams[queryParamKey] &&
          queryParams[queryParamKey] !==
            configsByKey[queryParamKey].defaultValue
      )
    ).length;
  }, [pageFiltersConfig, pageQueryParamsConfig, queryParams]);

  const resetAllFilters = useCallback(() => {
    const emptyQueryParamsObject = pageQueryParamsConfig.reduce(
      (acc, config) => ({
        ...acc,
        [config.key]: undefined,
      }),
      {}
    ) as PageQueryParamValues<P>;

    setQueryParams(
      pageFiltersConfig.reduce((acc, pageFilter) => {
        return {
          ...acc,
          ...pageFilter.getValue(emptyQueryParamsObject),
        };
      }, {})
    );
  }, [pageFiltersConfig, pageQueryParamsConfig, setQueryParams]);

  return (
    <>
      <styled.SearchInputContainer>
        <Input
          value={queryParams[searchQueryParamKey]}
          onChange={(event) =>
            setQueryParams({
              [searchQueryParamKey]: event.target.value,
            } as Partial<PageQueryParamSetterValues<P>>)
          }
          placeholder={searchPlaceholder}
          startEnhancer={() => <Search />}
          clearOnEscape
          overrides={overrides.searchInput}
        />
        <Button
          kind={areFiltersShown ? KIND.primary : KIND.secondary}
          onClick={() => {
            setAreFiltersShown((value) => !value);
          }}
          startEnhancer={Filter}
          overrides={overrides.filtersButton}
        >
          {activeFiltersCount === 0
            ? 'Filters'
            : `Filters (${activeFiltersCount})`}
        </Button>
      </styled.SearchInputContainer>
      {areFiltersShown && (
        <styled.SearchFiltersContainer>
          {pageFiltersConfig?.map((filter) => {
            return (
              <styled.SearchFilterContainer key={filter.id}>
                <filter.component
                  value={filter.getValue(queryParams)}
                  setValue={(newValue) =>
                    setQueryParams(filter.formatValue(newValue))
                  }
                />
              </styled.SearchFilterContainer>
            );
          })}
          <Button
            size={SIZE.compact}
            kind={KIND.tertiary}
            onClick={resetAllFilters}
            startEnhancer={Delete}
            overrides={overrides.clearFiltersButton}
          >
            Clear filters
          </Button>
        </styled.SearchFiltersContainer>
      )}
    </>
  );
}
