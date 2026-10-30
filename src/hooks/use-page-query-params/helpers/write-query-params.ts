import isObjectLike from 'lodash/isObjectLike';

import { QUERY_PARAMS_SYNC_EVENT } from '../use-page-query-params.constants';
import type {
  PageQueryParams,
  PageQueryParamSetterValues,
} from '../use-page-query-params.types';

import getUpdatedUrlSearch from './get-updated-url-search';
import isSameSearch from './is-same-search';

export default function writeQueryParams<P extends PageQueryParams>({
  config,
  newParams,
  replace,
  routePathname,
}: {
  config: P;
  newParams: Partial<PageQueryParamSetterValues<P>>;
  replace: boolean;
  routePathname: string | null;
}): void {
  if (!isObjectLike(newParams)) return;

  const {
    pathname: locationPathname,
    search: currentSearch,
    hash,
  } = window.location;
  if (locationPathname !== routePathname) return;
  const updatedUrlSearch = getUpdatedUrlSearch(
    config,
    newParams,
    currentSearch
  );
  if (isSameSearch(updatedUrlSearch, currentSearch)) return;
  const newHref =
    locationPathname + (updatedUrlSearch ? `?${updatedUrlSearch}` : '') + hash;

  // History writes do not emit an event.
  if (replace) window.history.replaceState(null, '', newHref);
  else window.history.pushState(null, '', newHref);
  if (
    window.location.pathname + window.location.search !==
    locationPathname + (updatedUrlSearch ? `?${updatedUrlSearch}` : '')
  )
    return;

  window.dispatchEvent(new Event(QUERY_PARAMS_SYNC_EVENT));
}
