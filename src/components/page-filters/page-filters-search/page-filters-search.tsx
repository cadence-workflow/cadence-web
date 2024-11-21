import React from 'react';

import { Search } from 'baseui/icon';
import { Input } from 'baseui/input';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import {
  type PageQueryParams,
  type PageQueryParamKeys,
  type PageQueryParamSetterValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { overrides } from './page-filters-search.styles';
import { type Props } from './page-filters-search.types';

export default function PageFiltersSearch<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
>({
  pageQueryParamsConfig,
  searchQueryParamKey,
  searchPlaceholder,
  searchTrimRegExp = /['"\s]/g,
}: Props<P, K>) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    pageQueryParamsConfig,
    { replace: true, pageRerender: false }
  );

  return (
    <Input
      value={queryParams[searchQueryParamKey]}
      onChange={(event) => {
        const searchValue = event.target.value.replaceAll(searchTrimRegExp, '');
        setQueryParams({
          [searchQueryParamKey]: searchValue || undefined,
        } as Partial<PageQueryParamSetterValues<P>>);
      }}
      placeholder={searchPlaceholder}
      startEnhancer={() => <Search />}
      clearable
      clearOnEscape
      overrides={overrides.searchInput}
    />
  );
}
