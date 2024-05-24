import React from 'react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Search, Filter, Delete } from 'baseui/icon';
import { Input } from 'baseui/input';

import { Props } from './page-filters.types';
import { styled, overrides } from './page-filters.styles';
import {
  type PageQueryParams,
  type PageQueryParamKeys,
  type PageQueryParamSetterValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';

export default function PageFilters<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
>({
  searchId,
  searchPlaceholder,
  pageFiltersConfig,
  pageQueryParamsConfig,
}: Props<P, K>) {
  const [areFiltersShown, setAreFiltersShown] = React.useState(false);
  const [queryParams, setQueryParams] = usePageQueryParams(
    pageQueryParamsConfig,
    { pageRerender: false }
  );

  const activeFiltersCount = React.useMemo(() => {
    const configsByKey = Object.fromEntries(
      pageQueryParamsConfig.map((c) => [c.key, c])
    );
    return pageFiltersConfig.filter((pageFilter) =>
      pageFilter.queryParamKeys.every(
        (queryParamKey) =>
          queryParams[queryParamKey] &&
          queryParams[queryParamKey] !==
            configsByKey[queryParamKey].defaultValue
      )
    ).length;
  }, [pageFiltersConfig, pageQueryParamsConfig, queryParams]);

  const resetAllFilters = React.useCallback(() => {
    setQueryParams(
      pageFiltersConfig.reduce(
        (acc, pageFilter) => {
          pageFilter.queryParamKeys.forEach((queryParamKey) => {
            acc[queryParamKey] = undefined;
          });
          return acc;
        },
        {} as Partial<PageQueryParamSetterValues<P>>
      )
    );
  }, [pageFiltersConfig, setQueryParams]);

  return (
    <>
      <styled.SearchInputContainer>
        <Input
          value={queryParams[searchId]}
          onChange={(event) =>
            setQueryParams({
              [searchId]: event.target.value,
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
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
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
