import { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import queryString from 'query-string';
import isObjectLike from 'lodash/isObjectLike';
import { useBetween } from 'use-between';
import usePreviousValue from '@/hooks/usePreviousValue';
import type { PageQueryParamConfig, PageQueryParamsSetter, QueryParamSetterExtraConfig, QueryParamsSetterObject, QueryParamsValues } from './types';
import { getPageQueryParamsValues, getUpdatedUrlSearch } from './utils';

const useShared_HistoryState = () => useBetween(useState<string>);

export default function usePageQueryParams(
  configs: PageQueryParamConfig[],
  extraConfig?: QueryParamSetterExtraConfig
): [QueryParamsValues, PageQueryParamsSetter] {
  // state shared across all usePageQueryParams instances so that when one of the hook uses history state (which doesn't cause full page rerender)
  // other usePageQueryParams hooks will get rerendered and update their internal value of window.location.search
  const [stateUrl, rerender] = useShared_HistoryState()
  const searchQueryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()
  const prevSearchQueryParam = usePreviousValue(searchQueryParams);

  const search = useMemo(() => {
    // get changed value from searchQueryParams if it was changed
    // otherwise change would be due history state change and search value is available in window.location.search
    if (prevSearchQueryParam !== searchQueryParams) return searchQueryParams.toString();
    return window.location.search;
    // stateUrl is needed in deps to recalculate window.location.search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQueryParams, prevSearchQueryParam, stateUrl]);
  const values = useMemo(() => {
    const urlQueryParamsObject = queryString.parse(search);
    return getPageQueryParamsValues(configs, urlQueryParamsObject);
  }, [configs, search]);

  const setter: PageQueryParamsSetter = useCallback(
    (newParams: QueryParamsSetterObject, setterExtraConfig?: QueryParamSetterExtraConfig) => {
      if (!isObjectLike(newParams)) {
        return;
      }
      const replace = extraConfig?.replace ?? setterExtraConfig?.replace ?? false;
      const pageRerender = extraConfig?.pageRerender ?? setterExtraConfig?.pageRerender ?? true;

      const updatedUrlSearch = getUpdatedUrlSearch(configs, newParams, search);
      const routerNavigate = replace ? router.replace : router.push;
      const stateNavigate = replace ? window.history.replaceState : window.history.pushState;
      const newHref = pathname + (updatedUrlSearch ? `?${updatedUrlSearch}` : '');

      if (pageRerender) {
        routerNavigate(newHref);
      } else {
        stateNavigate(window.history.state, '', newHref);
        rerender(newHref);
      }
    },
    [extraConfig?.replace, extraConfig?.pageRerender, search, configs, router.replace, router.push, pathname, rerender]
  );

  return [values, setter];
}