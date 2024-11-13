import React, { useState } from 'react';

import { Search } from 'baseui/icon';
import { Input } from 'baseui/input';

import {
  type PageQueryParams,
  type PageQueryParamKeys,
  type PageQueryParamSetterValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import usePageFilters from './hooks/use-page-filters';
import PageFiltersFields from './page-filters-fields/page-filters-fields';
import PageFiltersToggle from './page-filters-toggle/page-filters-toggle';
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
  searchTrimRegExp = /['"\s]/g,
}: Props<P, K>) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters<P>({ pageFiltersConfig, pageQueryParamsConfig });

  return (
    <>
      <styled.SearchInputContainer>
        <Input
          value={queryParams[searchQueryParamKey]}
          onChange={(event) => {
            const searchValue = searchTrimRegExp
              ? event.target.value.replaceAll(searchTrimRegExp, '')
              : event.target.value;

            setQueryParams({
              [searchQueryParamKey]: searchValue || undefined,
            } as Partial<PageQueryParamSetterValues<P>>);
          }}
          placeholder={searchPlaceholder}
          startEnhancer={() => <Search />}
          clearOnEscape
          overrides={overrides.searchInput}
        />
        <PageFiltersToggle
          isActive={areFiltersShown}
          onClick={() => {
            setAreFiltersShown((value) => !value);
          }}
          activeFiltersCount={activeFiltersCount}
        />
      </styled.SearchInputContainer>
      {areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={pageFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </>
  );
}
