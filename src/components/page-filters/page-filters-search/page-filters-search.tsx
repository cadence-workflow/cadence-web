import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Search } from 'baseui/icon';
import { Input } from 'baseui/input';
import debounce from 'lodash/debounce';

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
  inputDebounceDurationMs,
}: Props<P, K>) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    pageQueryParamsConfig,
    { replace: true, pageRerender: false }
  );

  const queryParamsSearch = queryParams[searchQueryParamKey];

  const [inputState, setInputState] = useState<string>('');

  useEffect(() => {
    setInputState(queryParamsSearch);
  }, [queryParamsSearch]);

  const setSearch = useCallback(
    (value: string) =>
      setQueryParams({ [searchQueryParamKey]: value } as Partial<
        PageQueryParamSetterValues<P>
      >),
    [searchQueryParamKey, setQueryParams]
  );

  const setSearchMaybeDebounced = useMemo(() => {
    if (inputDebounceDurationMs)
      return debounce(setSearch, inputDebounceDurationMs);
    return setSearch;
  }, [setSearch, inputDebounceDurationMs]);

  return (
    <Input
      value={inputState}
      onChange={(event) => {
        const searchValue = event.target.value.replaceAll(searchTrimRegExp, '');
        setInputState(searchValue);
        setSearchMaybeDebounced(searchValue);
      }}
      placeholder={searchPlaceholder}
      startEnhancer={() => <Search />}
      clearable
      clearOnEscape
      overrides={overrides.searchInput}
    />
  );
}
