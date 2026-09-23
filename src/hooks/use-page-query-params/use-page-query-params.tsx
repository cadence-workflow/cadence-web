import { useCallback, useMemo, useState } from 'react';

import isObjectLike from 'lodash/isObjectLike';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import queryString from 'query-string';
import { useBetween } from 'use-between';

import usePreviousValue from '@/hooks/use-previous-value';

import getPageQueryParamsValues from './helpers/get-page-query-params-values';
import getUpdatedUrlSearch from './helpers/get-updated-url-search';
import type {
  PageQueryParamSetter,
  PageQueryParamValues,
  PageQueryParams,
  QueryParamSetterExtraConfig,
} from './use-page-query-params.types';

const useShared_HistoryState = () => useBetween(useState<string>);

export default function usePageQueryParams<P extends PageQueryParams>(
  config: P,
  extraConfig?: QueryParamSetterExtraConfig
): [PageQueryParamValues<P>, PageQueryParamSetter<P>] {
  // state shared across all usePageQueryParams instances so that when one of the hook uses history state (which doesn't cause full page rerender)
  // other usePageQueryParams hooks will get rerendered and update their internal value of window.location.search
  const [stateUrl, rerender] = useShared_HistoryState();
  const searchQueryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const prevSearchQueryParam = usePreviousValue(searchQueryParams);

  const search = useMemo(() => {
    // get changed value from searchQueryParams if it was changed or in case of server side rendering
    // otherwise change would be due history state change and search value is available in window.location.search
    if (
      typeof window === 'undefined' ||
      (prevSearchQueryParam && prevSearchQueryParam !== searchQueryParams)
    )
      return searchQueryParams.toString();

    // First client render: a router navigation (e.g. opening another tab with
    // query params) can commit with the new params already in searchQueryParams
    // while window.location.search still shows the previous URL — and since
    // searchQueryParams won't change again, the hook would otherwise stay stuck
    // on that stale value. In this case searchQueryParams is the source of truth.
    //
    // The exception is an in-app history.pushState update (pageRerender:false):
    // useSearchParams does not track it, so window.location is ahead and
    // searchQueryParams is the *stale* one. Such updates record their href in
    // stateUrl, so when stateUrl matches the current URL we keep reading
    // window.location. We also fall back to window.location when searchQueryParams
    // is empty (the static-render case where useSearchParams is initially empty).
    const historyStateIsCurrent =
      stateUrl === pathname + window.location.search;
    if (!prevSearchQueryParam && !historyStateIsCurrent) {
      const searchFromParams = searchQueryParams.toString();
      if (searchFromParams) return searchFromParams;
    }

    return window.location.search;
    // stateUrl is needed in deps to recalculate window.location.search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQueryParams, prevSearchQueryParam, stateUrl, pathname]);

  const values: PageQueryParamValues<P> = useMemo(() => {
    const urlQueryParamsObject = queryString.parse(search);
    return getPageQueryParamsValues<P>(config, urlQueryParamsObject);
  }, [config, search]);

  const setter = useCallback<PageQueryParamSetter<P>>(
    (newParams, setterExtraConfig) => {
      if (!isObjectLike(newParams)) {
        return;
      }
      const replace =
        setterExtraConfig?.replace ?? extraConfig?.replace ?? false;
      const pageRerender =
        setterExtraConfig?.pageRerender ?? extraConfig?.pageRerender ?? true;

      const updatedUrlSearch = getUpdatedUrlSearch(config, newParams, search);
      const routerNavigate = replace ? router.replace : router.push;
      const stateNavigate = replace
        ? window.history.replaceState
        : window.history.pushState;
      const newHref =
        pathname + (updatedUrlSearch ? `?${updatedUrlSearch}` : '');

      if (pageRerender) {
        routerNavigate(newHref);
      } else {
        stateNavigate(window.history.state, '', newHref);
        rerender(newHref);
      }
    },
    [
      extraConfig?.replace,
      extraConfig?.pageRerender,
      search,
      config,
      router.replace,
      router.push,
      pathname,
      rerender,
    ]
  );

  return [values, setter];
}
