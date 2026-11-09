import isSameSearch from './is-same-search';
import readWindowSearch from './read-window-search';

export default function resolveLocationSearch(
  routePathname: string | null,
  currentSearch: string | null
): string | null {
  if (currentSearch === null || window.location.pathname !== routePathname) {
    return currentSearch;
  }

  const locationSearch = readWindowSearch();
  return isSameSearch(locationSearch, currentSearch)
    ? currentSearch
    : locationSearch;
}
