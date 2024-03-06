import { useCallback, useMemo, useState } from 'react';
import queryString from 'query-string';
import isObjectLike from 'lodash/isObjectLike';
import type { PageQueryParamConfig, PageQueryParamsSetter, QueryParamSetterExtraConfig, QueryParamsSetterObject, QueryParamsValues } from './types';
import { getPageQueryParamsValues, getUpdatedUrlSearch } from './utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useBetween } from 'use-between';

const useSharedHistoryState = () => useBetween(useState<string>);

export default function usePageQueryParams(
  configs: PageQueryParamConfig[],
  extraConfig?: QueryParamSetterExtraConfig
): [QueryParamsValues, PageQueryParamsSetter] {
  // state shared across all usePageQueryParams instances so that when one of the hook uses history state (which doesn't cause full page rerender)
  // other usePageQueryParams hooks will get rerendered and update their internal value of window.location.search
  const [, rerender] = useSharedHistoryState()
  const searchQueryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()

  const search = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.search;
    return searchQueryParams.toString();
  }, [searchQueryParams, typeof window !== 'undefined' && window.location.search]);

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
        routerNavigate(newHref)
      } else {
        stateNavigate(window.history.state, '', newHref);
        rerender(newHref)
      }
    },
    [router, configs, search]
  );

  return [values, setter];
}