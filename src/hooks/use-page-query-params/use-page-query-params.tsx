import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

import getPageQueryParamsValues from './helpers/get-page-query-params-values';
import isSameSearch from './helpers/is-same-search';
import readWindowSearch from './helpers/read-window-search';
import resolveLocationSearch from './helpers/resolve-location-search';
import resolveMountSearch from './helpers/resolve-mount-search';
import writeQueryParams from './helpers/write-query-params';
import {
  QUERY_PARAMS_SYNC_EVENT,
  WATCHDOG_DELAY_MS,
  WATCHDOG_RECHECK_MS,
} from './use-page-query-params.constants';
import type {
  PageQueryParamSetter,
  PageQueryParamValues,
  PageQueryParams,
  QueryParamSetterExtraConfig,
} from './use-page-query-params.types';

export default function usePageQueryParams<P extends PageQueryParams>(
  config: P,
  extraConfig?: QueryParamSetterExtraConfig
): [PageQueryParamValues<P>, PageQueryParamSetter<P>] {
  const pathname = usePathname();
  const basePath = process.env.__NEXT_ROUTER_BASEPATH ?? '';
  const routePathname = pathname === null ? null : basePath + pathname;
  const nextSearch = useSearchParams().toString();
  const [search, setSearch] = useState<string | null>(null);
  const lastNextUrlRef = useRef(`${routePathname}?${nextSearch}`);

  useEffect(() => {
    setSearch(resolveMountSearch(routePathname, nextSearch));

    const onUrlChange = () => setSearch(readWindowSearch());
    const urlEvents = ['popstate', QUERY_PARAMS_SYNC_EVENT];
    urlEvents.forEach((event) => window.addEventListener(event, onUrlChange));
    return () =>
      urlEvents.forEach((event) =>
        window.removeEventListener(event, onUrlChange)
      );
    // These values capture the URL from the first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const key = `${routePathname}?${nextSearch}`;
    if (lastNextUrlRef.current === key) return;
    lastNextUrlRef.current = key;
    setSearch((prev) =>
      prev !== null && isSameSearch(nextSearch, prev) ? prev : nextSearch
    );
  }, [nextSearch, routePathname]);

  // Next can change window.location after its search params have updated.
  useEffect(() => {
    if (search === null) return;
    const readLocation = () =>
      setSearch((current) => resolveLocationSearch(routePathname, current));
    let recheck: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      readLocation();
      recheck = setTimeout(readLocation, WATCHDOG_RECHECK_MS);
    }, WATCHDOG_DELAY_MS);
    return () => {
      clearTimeout(timer);
      if (recheck) clearTimeout(recheck);
    };
  }, [search, routePathname]);

  const values: PageQueryParamValues<P> = useMemo(
    () =>
      getPageQueryParamsValues<P>(
        config,
        queryString.parse(search ?? nextSearch)
      ),
    [config, search, nextSearch]
  );

  const setter = useCallback<PageQueryParamSetter<P>>(
    (newParams, setterExtraConfig) =>
      writeQueryParams({
        config,
        newParams,
        replace: setterExtraConfig?.replace ?? extraConfig?.replace ?? false,
        routePathname,
      }),
    [extraConfig?.replace, config, routePathname]
  );

  return [values, setter];
}
