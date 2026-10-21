import { useCallback, useEffect, useMemo, useState } from 'react';

import isObjectLike from 'lodash/isObjectLike';
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';

import getPageQueryParamsValues from './helpers/get-page-query-params-values';
import getUpdatedUrlSearch from './helpers/get-updated-url-search';
import type {
  PageQueryParamSetter,
  PageQueryParamValues,
  PageQueryParams,
  QueryParamSetterExtraConfig,
} from './use-page-query-params.types';

// Lets sibling hook instances re-read the URL after a History write.
const QUERY_PARAMS_SYNC_EVENT = 'cadence:page-query-params';

const readWindowSearch = () => window.location.search.replace(/^\?/, '');

export default function usePageQueryParams<P extends PageQueryParams>(
  config: P,
  extraConfig?: QueryParamSetterExtraConfig
): [PageQueryParamValues<P>, PageQueryParamSetter<P>] {
  const nextSearch = useSearchParams().toString();
  // null only until mount: SSR, hydration and the first render after a Link navigation (URL bar not updated yet) use Next's value.
  // After mount window.location is the source of truth: after racing Back/Forward Next's router state can stay stale.
  const [windowSearch, setWindowSearch] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setWindowSearch(readWindowSearch());
    window.addEventListener('popstate', sync);
    window.addEventListener(QUERY_PARAMS_SYNC_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(QUERY_PARAMS_SYNC_EVENT, sync);
    };
  }, []);

  // Next navigated (Link/router): the URL bar is updated by now.
  useEffect(() => {
    setWindowSearch(readWindowSearch());
  }, [nextSearch]);

  const search = windowSearch ?? nextSearch;

  const values: PageQueryParamValues<P> = useMemo(
    () => getPageQueryParamsValues<P>(config, queryString.parse(search)),
    [config, search]
  );

  const setter = useCallback<PageQueryParamSetter<P>>(
    (newParams, setterExtraConfig) => {
      if (!isObjectLike(newParams)) return;
      const replace =
        setterExtraConfig?.replace ?? extraConfig?.replace ?? false;

      // read at call time: render-time search is stale for back-to-back setters
      const { pathname, search: currentSearch } = window.location;
      const updatedUrlSearch = getUpdatedUrlSearch(
        config,
        newParams,
        currentSearch
      );
      const newHref =
        pathname + (updatedUrlSearch ? `?${updatedUrlSearch}` : '');
      if (newHref === pathname + currentSearch) return;

      // null state: with Next's __NA state its History patch skips the useSearchParams sync
      if (replace) window.history.replaceState(null, '', newHref);
      else window.history.pushState(null, '', newHref);
      window.dispatchEvent(new Event(QUERY_PARAMS_SYNC_EVENT));
    },
    [extraConfig?.replace, config]
  );

  return [values, setter];
}
